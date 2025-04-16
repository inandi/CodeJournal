import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

interface Comment {
    line: number;
    text: string;
}

interface CommentStorage {
    [filePath: string]: Comment[];
}

export class StorageService {
    private storageFilePath: string;
    private comments: Record<string, { line: number; text: string }[]> = {};

    constructor() {
        const projectRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
        if (!projectRoot) {
            throw new Error('Workspace folder not found.');
        }

        this.storageFilePath = path.join('.vscode', 'comments.json');
        this.initializeStorage(projectRoot);
        this.loadComments(projectRoot);
    }

    private initializeStorage(projectRoot: string) {
        const vscodeDir = path.join(projectRoot, '.vscode');
        if (!fs.existsSync(vscodeDir)) {
            fs.mkdirSync(vscodeDir, { recursive: true });
        }
        const fullPath = path.join(projectRoot, this.storageFilePath);
        if (!fs.existsSync(fullPath)) {
            fs.writeFileSync(fullPath, JSON.stringify({}));
        }
    }

    private loadComments(projectRoot: string): void {
        const fullPath = path.join(projectRoot, this.storageFilePath);
        if (fs.existsSync(fullPath)) {
            const commentsData = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
            this.comments = commentsData;
        }
    }

    private updateStorage(relativeFilePath: string, comments: Comment[]): void {
        const projectRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
        if (!projectRoot) {
            throw new Error('Workspace folder not found.');
        }

        const fullPath = path.join(projectRoot, this.storageFilePath);
        const storage = this.loadStorage(projectRoot);

        // Use the relative file path as the key
        storage[relativeFilePath] = comments;

        fs.writeFileSync(fullPath, JSON.stringify(storage, null, 2));
    }

    private loadStorage(projectRoot: string): CommentStorage {
        const fullPath = path.join(projectRoot, this.storageFilePath);
        if (fs.existsSync(fullPath)) {
            const data = fs.readFileSync(fullPath, 'utf-8');
            return JSON.parse(data);
        }
        return {};
    }

    public saveComment(filePath: string, line: number, text: string): void {
        const projectRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
        if (!projectRoot) {
            throw new Error('Workspace folder not found.');
        }
        const relativeFilePath = path.relative(path.join(projectRoot, '.vscode'), filePath);
        const comments = this.getComments(filePath);
        const existingCommentIndex = comments.findIndex(comment => comment.line === line);
        if (existingCommentIndex !== -1) {
            comments[existingCommentIndex].text = text;
        } else {
            comments.push({ line, text });
        }
        this.updateStorage(relativeFilePath, comments);
    }

    public updateComment(filePath: string, line: number, newText: string): void {
        const projectRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
        if (!projectRoot) {
            throw new Error('Workspace folder not found.');
        }

        const relativeFilePath = path.relative(path.join(projectRoot, '.vscode'), filePath);
        const comments = this.getComments(filePath);
        const commentIndex = comments.findIndex(comment => comment.line === line);
        if (commentIndex !== -1) {
            comments[commentIndex].text = newText;
            this.updateStorage(relativeFilePath, comments);
        }
    }

    public deleteComment(filePath: string, line: number): void {
        const projectRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
        if (!projectRoot) {
            throw new Error('Workspace folder not found.');
        }
        const relativeFilePath = path.relative(path.join(projectRoot, '.vscode'), filePath);
        const comments = this.getComments(filePath);
        const updatedComments = comments.filter(comment => comment.line !== line);
        this.updateStorage(relativeFilePath, updatedComments);
    }

    public getComments(filePath: string): Comment[] {
        const projectRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
        if (!projectRoot) {
            throw new Error('Workspace folder not found.');
        }
        const relativeFilePath = path.relative(path.join(projectRoot, '.vscode'), filePath);
        const storage = this.loadStorage(projectRoot);
        return storage[relativeFilePath] || [];
    }

    getComment(filePath: string, lineNumber: number): string | undefined {
        const projectRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
        if (!projectRoot) {
            throw new Error('Workspace folder not found.');
        }
        const relativeFilePath = path.relative(path.join(projectRoot, '.vscode'), filePath);
        const fileComments = this.comments[relativeFilePath];
        if (fileComments) {
            const commentObj = fileComments.find(comment => comment.line === lineNumber);
            return commentObj ? commentObj.text : undefined;
        }
        return undefined;
    }

}