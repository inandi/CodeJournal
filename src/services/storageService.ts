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
        // Save comments.json in the .vscode directory of the project
        const projectRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
        if (!projectRoot) {
            throw new Error('Workspace folder not found.');
        }
        // Use a relative path for the .vscode/comments.json file
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
    
    private updateStorage(filePath: string, comments: Comment[]): void {
        const projectRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
        if (!projectRoot) {
            throw new Error('Workspace folder not found.');
        }
    
        const fullPath = path.join(projectRoot, this.storageFilePath);
        const storage = this.loadStorage(projectRoot);
    
        // Use the relative file path as the key
        storage[filePath] = comments;
    
        fs.writeFileSync(fullPath, JSON.stringify(storage, null, 2));
    }

    // private updateStorage(filePath: string, comments: Comment[]): void {
    //     const projectRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
    //     if (!projectRoot) {
    //         throw new Error('Workspace folder not found.');
    //     }
    //     const fullPath = path.join(projectRoot, this.storageFilePath);
    //     const storage = this.loadStorage(projectRoot);
    //     storage[filePath] = comments;
    //     fs.writeFileSync(fullPath, JSON.stringify(storage, null, 2));
    // }
    
    private loadStorage(projectRoot: string): CommentStorage {
        const fullPath = path.join(projectRoot, this.storageFilePath);
        if (fs.existsSync(fullPath)) {
            const data = fs.readFileSync(fullPath, 'utf-8');
            return JSON.parse(data);
        }
        return {};
    }



    // constructor() {
    //     this.storageFilePath = path.join(__dirname, 'comments.json');
    //     this.initializeStorage();
    //     this.loadComments();
    // }

    // constructor() {
    //     // Save comments.json in the .vscode directory of the project
    //     const projectRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
    //     if (!projectRoot) {
    //         throw new Error('Workspace folder not found.');
    //     }
    //     this.storageFilePath = path.join(projectRoot, '.vscode', 'comments.json');
    //     this.initializeStorage();
    //     this.loadComments();
    // }

    

    // private loadComments(): void {
    //     // Simulate loading from a JSON file
    //     const commentsData = require('./comments.json');
    //     this.comments = commentsData;
    // }

    // private initializeStorage() {
    //     if (!fs.existsSync(this.storageFilePath)) {
    //         fs.writeFileSync(this.storageFilePath, JSON.stringify({}));
    //     }
    // }

    // private initializeStorage() {
    //     const vscodeDir = path.dirname(this.storageFilePath);
    //     if (!fs.existsSync(vscodeDir)) {
    //         fs.mkdirSync(vscodeDir, { recursive: true });
    //     }
    //     if (!fs.existsSync(this.storageFilePath)) {
    //         fs.writeFileSync(this.storageFilePath, JSON.stringify({}));
    //     }
    // }

    // public saveComment(filePath: string, line: number, text: string): void {
    //     const comments = this.getComments(filePath);
    //     comments.push({ line, text });
    //     this.updateStorage(filePath, comments);
    // }

    public saveComment(filePath: string, line: number, text: string): void {
        const projectRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
        if (!projectRoot) {
            throw new Error('Workspace folder not found.');
        }
    
        // Convert the file path to a relative path
        const relativeFilePath = path.relative(path.join(projectRoot, '.vscode'), filePath);
    
        const comments = this.getComments(relativeFilePath);
        comments.push({ line, text });
        this.updateStorage(relativeFilePath, comments);
    }

    
    public updateComment(filePath: string, line: number, newText: string): void {
        const comments = this.getComments(filePath);
        const commentIndex = comments.findIndex(comment => comment.line === line);
        if (commentIndex !== -1) {
            comments[commentIndex].text = newText;
            this.updateStorage(filePath, comments);
        }
    }

    public deleteComment(filePath: string, line: number): void {
        const comments = this.getComments(filePath);
        const updatedComments = comments.filter(comment => comment.line !== line);
        this.updateStorage(filePath, updatedComments);
    }

    // public getComments(filePath: string): Comment[] {
    //     const projectRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
    //     if (!projectRoot) {
    //         throw new Error('Workspace folder not found.');
    //     }
    //     const storage = this.loadStorage(projectRoot);
    //     return storage[filePath] || [];
    // }
    
    public getComments(filePath: string): Comment[] {
        const projectRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
        if (!projectRoot) {
            throw new Error('Workspace folder not found.');
        }
    
        // Convert the file path to a relative path
        const relativeFilePath = path.relative(path.join(projectRoot, '.vscode'), filePath);
    
        const storage = this.loadStorage(projectRoot);
        return storage[relativeFilePath] || [];
    }

    getComment(filePath: string, lineNumber: number): string | undefined {
        const fileComments = this.comments[filePath];
        if (fileComments) {
            const commentObj = fileComments.find(comment => comment.line === lineNumber);
            return commentObj ? commentObj.text : undefined;
        }
        return undefined;
    }

    // private loadStorage(): CommentStorage {
    //     const data = fs.readFileSync(this.storageFilePath, 'utf-8');
    //     return JSON.parse(data);
    // }

    // private updateStorage(filePath: string, comments: Comment[]): void {
    //     const storage = this.loadStorage();
    //     storage[filePath] = comments;
    //     fs.writeFileSync(this.storageFilePath, JSON.stringify(storage, null, 2));
    // }
}