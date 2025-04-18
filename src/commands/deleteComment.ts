import * as vscode from 'vscode';
import { StorageService } from './../services/storageService';

export async function deleteComment() {
    const storageService = new StorageService();
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
        vscode.window.showErrorMessage('No active editor found.');
        return;
    }
    const filePath = vscode.window.activeTextEditor?.document.uri.fsPath;
    if (!filePath) {
        vscode.window.showErrorMessage('No active file to retrieve comments from.');
        return;
    }
    const comments = await storageService.getComments(filePath);
    const lineNumber = activeEditor.selection.active.line + 1;
    const commentLine = comments.find(comment => comment.line === lineNumber);
    if (commentLine === undefined) {
        vscode.window.showWarningMessage(`No comment found on line ${lineNumber}.`);
        return;
    }
    storageService.deleteComment(filePath, lineNumber);
    vscode.window.showInformationMessage(`Comment deleted from line: ${lineNumber}`);
}