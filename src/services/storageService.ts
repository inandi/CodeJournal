/**
 * Storage service for Code Journal comments (read/write .vscode/comments.json).
 *
 * @author Gobinda Nandi <gobinda.nandi.public@gmail.com>
 * @since 0.0.1 [25-04-2025]
 * @version 1.1.1
 * @copyright (c) 2025 Gobinda Nandi
 */

import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import type { Comment, CommentStorage } from '../types';

/**
 * Manages persistence of comments in workspace .vscode/comments.json.
 * Handles line-number adjustment on edits and path updates on rename/delete.
 *
 * @author Gobinda Nandi <gobinda.nandi.public@gmail.com>
 * @since 0.0.1 [25-04-2025]
 * @version 1.1.1
 */
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

    /**
     * Converts absolute file path to workspace-relative path with forward slashes.
     *
     * @private
     * @param {string} filePath - Absolute file path
     * @returns {string} Workspace-relative path with forward slashes
     * @version 1.1.1
     */
    private toRelativePath(filePath: string): string {
        const rel = path.relative(this.getProjectRoot(), filePath);
        return rel.replace(/\\/g, '/');
    }

    private loadStorage(): CommentStorage {
        const fullPath = path.join(this.getProjectRoot(), this.storageFilePath);
        if (fs.existsSync(fullPath)) {
            const raw = JSON.parse(fs.readFileSync(fullPath, 'utf-8')) as CommentStorage;
            const normalized: CommentStorage = {};
            for (const [key, comments] of Object.entries(raw)) {
                normalized[key.replace(/\\/g, '/')] = comments;
            }
            return normalized;
        }
        return {};
    }

    private writeStorage(storage: CommentStorage): void {
        const fullPath = path.join(this.getProjectRoot(), this.storageFilePath);
        fs.writeFileSync(fullPath, JSON.stringify(storage, null, 2));
    }

    private static utcNow(): string {
        return new Date().toISOString();
    }

    /**
     * Saves or updates a comment for a file and line. Sets updatedAt to current UTC.
     *
     * @param {string} filePath - File fs path
     * @param {number} line - 1-based line number
     * @param {string} text - Comment text
     * @returns {void}
     * @version 1.1.1
     */
    public saveComment(filePath: string, line: number, text: string): void {
        const key = this.toRelativePath(filePath);
        const comments = this.getComments(filePath);
        const now = StorageService.utcNow();
        const existingIndex = comments.findIndex((c) => c.line === line);
        if (existingIndex !== -1) {
            comments[existingIndex].text = text;
            comments[existingIndex].updatedAt = now;
        } else {
            comments.push({ line, text, updatedAt: now });
        }
        const storage = this.loadStorage();
        storage[key] = comments;
        this.writeStorage(storage);
    }

    /**
     * Updates existing comment text and updatedAt for a file and line.
     *
     * @param {string} filePath - File fs path
     * @param {number} line - 1-based line number
     * @param {string} newText - New comment text
     * @returns {void}
     * @version 1.1.1
     */
    public updateComment(filePath: string, line: number, newText: string): void {
        const key = this.toRelativePath(filePath);
        const comments = this.getComments(filePath);
        const index = comments.findIndex((c) => c.line === line);
        if (index !== -1) {
            comments[index].text = newText;
            comments[index].updatedAt = StorageService.utcNow();
            const storage = this.loadStorage();
            storage[key] = comments;
            this.writeStorage(storage);
        }
    }

    /**
     * Deletes the comment at the given file and line.
     *
     * @param {string} filePath - File fs path
     * @param {number} line - 1-based line number
     * @returns {void}
     * @version 1.1.1
     */
    public deleteComment(filePath: string, line: number): void {
        const key = this.toRelativePath(filePath);
        const comments = this.getComments(filePath).filter((c) => c.line !== line);
        const storage = this.loadStorage();
        storage[key] = comments;
        this.writeStorage(storage);
    }

    /**
     * Gets all comments for a file (uses first workspace folder).
     *
     * @param {string} filePath - File fs path
     * @returns {Comment[]} Array of comments
     * @version 1.1.1
     */
    public getComments(filePath: string): Comment[] {
        const key = this.toRelativePath(filePath);
        const storage = this.loadStorage();
        return storage[key] ?? [];
    }

    /**
     * Gets the comment at a specific line for a file.
     *
     * @param {string} filePath - File fs path
     * @param {number} lineNumber - 1-based line number
     * @returns {Comment | undefined} The comment if found
     * @version 1.1.1
     */
    public getComment(filePath: string, lineNumber: number): Comment | undefined {
        const comments = this.getComments(filePath);
        return comments.find((c) => c.line === lineNumber);
    }

    /**
     * Gets all comments for a file in a specific workspace root (multi-root safe).
     *
     * @param {string} workspaceRootPath - Workspace root fs path
     * @param {string} filePath - File fs path
     * @returns {Comment[]} Array of comments for the file
     * @version 1.1.1
     */
    public static getCommentsAt(
        workspaceRootPath: string,
        filePath: string
    ): Comment[] {
        const keyNormalized = path.relative(workspaceRootPath, filePath).replace(/\\/g, '/');
        const storagePath = path.join(workspaceRootPath, '.vscode', 'comments.json');
        if (!fs.existsSync(storagePath)) {
            return [];
        }
        const raw = JSON.parse(fs.readFileSync(storagePath, 'utf-8')) as CommentStorage;
        for (const [k, c] of Object.entries(raw)) {
            if (k.replace(/\\/g, '/') === keyNormalized) {
                return c;
            }
        }
        return [];
    }

    /**
     * Gets comment at a line for a file in a specific workspace root (multi-root safe).
     *
     * @param {string} workspaceRootPath - Workspace root fs path
     * @param {string} filePath - File fs path
     * @param {number} lineNumber - 1-based line number
     * @returns {Comment | undefined} The comment if found
     * @version 1.1.1
     */
    public static getCommentAt(
        workspaceRootPath: string,
        filePath: string,
        lineNumber: number
    ): Comment | undefined {
        const comments = StorageService.getCommentsAt(workspaceRootPath, filePath);
        return comments.find((c) => c.line === lineNumber);
    }

    /**
     * Adjusts comment line numbers when the document is edited (lines inserted or deleted).
     * Call from onDidChangeTextDocument. Comments on deleted lines are removed.
     *
     * @param {string} filePath - Document file path
     * @param {ReadonlyArray<{ range: vscode.Range; text: string }>} contentChanges - VS Code content changes
     * @returns {void}
     * @version 1.1.1
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
                // Number of lines in the new text: empty => 0, else count newlines + 1
                const newLineCount =
                    c.text === '' ? 0 : (c.text.match(/\n/g) ?? []).length + 1;
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

    /**
     * Moves comments from old path to new path when a file is renamed/moved (same workspace).
     * Call from onDidRenameFiles.
     *
     * @param {string} workspaceRootPath - Workspace root fs path
     * @param {string} oldFilePath - Previous file fs path
     * @param {string} newFilePath - New file fs path
     * @returns {void}
     * @version 1.1.1
     */
    public static renameFileComments(
        workspaceRootPath: string,
        oldFilePath: string,
        newFilePath: string
    ): void {
        const oldKey = path.relative(workspaceRootPath, oldFilePath).replace(/\\/g, '/');
        const newKey = path.relative(workspaceRootPath, newFilePath).replace(/\\/g, '/');
        if (oldKey === newKey) {
            return;
        }
        const storagePath = path.join(workspaceRootPath, '.vscode', 'comments.json');
        if (!fs.existsSync(storagePath)) {
            return;
        }
        const raw = JSON.parse(fs.readFileSync(storagePath, 'utf-8')) as CommentStorage;
        let comments: Comment[] | undefined;
        const normalized: CommentStorage = {};
        for (const [k, v] of Object.entries(raw)) {
            const nk = k.replace(/\\/g, '/');
            if (nk === oldKey) {
                comments = v;
            } else {
                normalized[nk] = v;
            }
        }
        if (comments !== undefined) {
            normalized[newKey] = comments;
        }
        fs.writeFileSync(storagePath, JSON.stringify(normalized, null, 2));
    }

    /**
     * Removes comments for a deleted file. Call from onDidDeleteFiles.
     *
     * @param {string} workspaceRootPath - Workspace root fs path
     * @param {string} filePath - Deleted file fs path
     * @returns {void}
     * @version 1.1.1
     */
    public static removeFileComments(workspaceRootPath: string, filePath: string): void {
        const key = path.relative(workspaceRootPath, filePath).replace(/\\/g, '/');
        const storagePath = path.join(workspaceRootPath, '.vscode', 'comments.json');
        if (!fs.existsSync(storagePath)) {
            return;
        }
        const raw = JSON.parse(fs.readFileSync(storagePath, 'utf-8')) as CommentStorage;
        const normalized: CommentStorage = {};
        for (const [k, v] of Object.entries(raw)) {
            const nk = k.replace(/\\/g, '/');
            if (nk !== key) {
                normalized[nk] = v;
            }
        }
        fs.writeFileSync(storagePath, JSON.stringify(normalized, null, 2));
    }
}
