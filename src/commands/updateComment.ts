import * as vscode from 'vscode';
import { StorageService } from './../services/storageService';

export async function updateComment() {
    const storageService = new StorageService();
    const filePath = vscode.window.activeTextEditor?.document.uri.fsPath;
    if (!filePath) {
        vscode.window.showErrorMessage('No active file to update comments for.');
        return;
    }
    const comments = await storageService.getComments(filePath);

    const lineNumber = await vscode.window.showInputBox({
        prompt: 'Enter the line number of the comment you want to update',
        validateInput: (value) => {
            const lineNum = parseInt(value);
            return isNaN(lineNum) || lineNum < 0 ? 'Please enter a valid line number.' : null;
        }
    });

    if (lineNumber) {
        const existingComment = comments.find(comment => comment.line === parseInt(lineNumber));
        if (existingComment) {
            const newComment = await vscode.window.showInputBox({
                prompt: 'Enter the new comment',
                value: existingComment.text
            });

            if (newComment) {
                existingComment.text = newComment;
                storageService.updateComment(filePath, existingComment.line, existingComment.text);
                vscode.window.showInformationMessage('Comment updated successfully!');
            }
        } else {
            vscode.window.showWarningMessage('No comment found on that line.');
        }
    }
}