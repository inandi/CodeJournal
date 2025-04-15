export interface Comment {
    line: number;
    text: string;
    timestamp: Date;
}

export interface CommentStorage {
    [filePath: string]: Comment[];
}