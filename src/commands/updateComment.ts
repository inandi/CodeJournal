import * as vscode from 'vscode';
import { StorageService } from './../services/storageService';

export async function updateComment() {
    const storageService = new StorageService();
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
        vscode.window.showErrorMessage('No active editor found.');
        return;
    }
    const filePath = vscode.window.activeTextEditor?.document.uri.fsPath;
    if (!filePath) {
        vscode.window.showErrorMessage('No active file to update comments for.');
        return;
    }
    const comments = await storageService.getComments(filePath);
    const lineNumber = activeEditor.selection.active.line + 1; // Line numbers are 0-based, so add 1 for display purposes.

    if (lineNumber) {
        const existingComment = comments.find(comment => comment.line === lineNumber);
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