import * as vscode from 'vscode';
import { StorageService } from './../services/storageService';

export async function deleteComment() {
    const storageService = new StorageService();
    const filePath = vscode.window.activeTextEditor?.document.uri.fsPath;
    if (!filePath) {
        vscode.window.showErrorMessage('No active file to retrieve comments from.');
        return;
    }
    const comments = await storageService.getComments(filePath);

    if (comments.length === 0) {
        vscode.window.showInformationMessage('No comments available to delete.');
        return;
    }

    const commentToDelete = await vscode.window.showQuickPick(comments.map(comment => comment.text), {
        placeHolder: 'Select a comment to delete'
    });

    if (!commentToDelete) {
        return;
    }

    const commentLine = comments.find(comment => comment.text === commentToDelete)?.line;
    if (commentLine === undefined) {
        vscode.window.showErrorMessage('Failed to find the selected comment.');
        return;
    }
    storageService.deleteComment(filePath, commentLine);
    vscode.window.showInformationMessage(`Comment deleted: ${commentToDelete}`);
}