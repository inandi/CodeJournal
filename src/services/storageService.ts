import * as fs from 'fs';
import * as path from 'path';

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
        this.storageFilePath = path.join(__dirname, 'comments.json');
        this.initializeStorage();
        this.loadComments();
    }

    private loadComments(): void {
        // Simulate loading from a JSON file
        const commentsData = require('./comments.json');
        this.comments = commentsData;
    }

    private initializeStorage() {
        if (!fs.existsSync(this.storageFilePath)) {
            fs.writeFileSync(this.storageFilePath, JSON.stringify({}));
        }
    }

    public saveComment(filePath: string, line: number, text: string): void {
        const comments = this.getComments(filePath);
        comments.push({ line, text });
        this.updateStorage(filePath, comments);
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

    public getComments(filePath: string): Comment[] {
        const storage = this.loadStorage();
        return storage[filePath] || [];
    }
    
    getComment(filePath: string, lineNumber: number): string | undefined {
        const fileComments = this.comments[filePath];
        if (fileComments) {
            const commentObj = fileComments.find(comment => comment.line === lineNumber);
            return commentObj ? commentObj.text : undefined;
        }
        return undefined;
    }

    private loadStorage(): CommentStorage {
        const data = fs.readFileSync(this.storageFilePath, 'utf-8');
        return JSON.parse(data);
    }

    private updateStorage(filePath: string, comments: Comment[]): void {
        const storage = this.loadStorage();
        storage[filePath] = comments;
        fs.writeFileSync(this.storageFilePath, JSON.stringify(storage, null, 2));
    }
}