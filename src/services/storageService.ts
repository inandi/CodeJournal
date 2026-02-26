import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import type { Comment, CommentStorage } from '../types';

export class StorageService {
    private readonly storageFilePath = path.join('.vscode', 'comments.json');

    constructor() {
        const projectRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
        if (!projectRoot) {
            throw new Error('Workspace folder not found.');
        }
        this.initializeStorage(projectRoot);
    }

    private initializeStorage(projectRoot: string): void {
        const vscodeDir = path.join(projectRoot, '.vscode');
        if (!fs.existsSync(vscodeDir)) {
            fs.mkdirSync(vscodeDir, { recursive: true });
        }
        const fullPath = path.join(projectRoot, this.storageFilePath);
        if (!fs.existsSync(fullPath)) {
            fs.writeFileSync(fullPath, JSON.stringify({}));
        }
    }

    private getProjectRoot(): string {
        const projectRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
        if (!projectRoot) {
            throw new Error('Workspace folder not found.');
        }
        return projectRoot;
    }

    private toRelativePath(filePath: string): string {
        return path.relative(this.getProjectRoot(), filePath);
    }

    private loadStorage(): CommentStorage {
        const fullPath = path.join(this.getProjectRoot(), this.storageFilePath);
        if (fs.existsSync(fullPath)) {
            return JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
        }
        return {};
    }

    private writeStorage(storage: CommentStorage): void {
        const fullPath = path.join(this.getProjectRoot(), this.storageFilePath);
        fs.writeFileSync(fullPath, JSON.stringify(storage, null, 2));
    }

    public saveComment(filePath: string, line: number, text: string): void {
        const key = this.toRelativePath(filePath);
        const comments = this.getComments(filePath);
        const existingIndex = comments.findIndex((c) => c.line === line);
        if (existingIndex !== -1) {
            comments[existingIndex].text = text;
        } else {
            comments.push({ line, text });
        }
        const storage = this.loadStorage();
        storage[key] = comments;
        this.writeStorage(storage);
    }

    public updateComment(filePath: string, line: number, newText: string): void {
        const key = this.toRelativePath(filePath);
        const comments = this.getComments(filePath);
        const index = comments.findIndex((c) => c.line === line);
        if (index !== -1) {
            comments[index].text = newText;
            const storage = this.loadStorage();
            storage[key] = comments;
            this.writeStorage(storage);
        }
    }

    public deleteComment(filePath: string, line: number): void {
        const key = this.toRelativePath(filePath);
        const comments = this.getComments(filePath).filter((c) => c.line !== line);
        const storage = this.loadStorage();
        storage[key] = comments;
        this.writeStorage(storage);
    }

    public getComments(filePath: string): Comment[] {
        const key = this.toRelativePath(filePath);
        const storage = this.loadStorage();
        return storage[key] ?? [];
    }

    public getComment(filePath: string, lineNumber: number): string | undefined {
        const comments = this.getComments(filePath);
        const comment = comments.find((c) => c.line === lineNumber);
        return comment?.text;
    }

    /**
     * Adjust comment line numbers when the document is edited (lines inserted or deleted).
     * Call this from onDidChangeTextDocument. Comments on deleted lines are removed.
     */
    public applyLineChanges(
        filePath: string,
        contentChanges: ReadonlyArray<{ range: vscode.Range; text: string }>
    ): void {
        const key = this.toRelativePath(filePath);
        const storage = this.loadStorage();
        let comments = [...(storage[key] ?? [])];
        if (comments.length === 0) {
            return;
        }

        // Process changes from bottom to top so line numbers stay valid
        const changes = contentChanges
            .map((c) => {
                const newLineCount =
                    c.text === ''
                        ? 0
                        : 1 + (c.text.match(/\n/g) ?? []).length - (c.text.endsWith('\n') ? 1 : 0);
                return {
                    startLine1: c.range.start.line + 1,
                    endLine1: c.range.end.line + 1,
                    oldLineCount: c.range.end.line - c.range.start.line + 1,
                    newLineCount,
                };
            })
            .filter((ch) => ch.oldLineCount !== ch.newLineCount)
            .sort((a, b) => b.endLine1 - a.endLine1);

        for (const ch of changes) {
            const delta = ch.newLineCount - ch.oldLineCount;
            comments = comments
                .filter((c) => c.line < ch.startLine1 || c.line > ch.endLine1)
                .map((c) => ({
                    ...c,
                    line: c.line > ch.endLine1 ? c.line + delta : c.line,
                }));
        }

        storage[key] = comments.sort((a, b) => a.line - b.line);
        this.writeStorage(storage);
    }
}
