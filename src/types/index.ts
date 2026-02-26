export interface Comment {
    line: number;
    text: string;
}

export interface CommentStorage {
    [filePath: string]: Comment[];
}