import * as vscode from 'vscode';
import { StorageService } from "./../services/storageService";

export async function addComment() {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
        vscode.window.showErrorMessage('No active editor found.');
        return;
    }
    const lineNumber = activeEditor.selection.active.line + 1; // Line numbers are 0-based, so add 1 for display purposes.
    const comment = await vscode.window.showInputBox({
        prompt: `Enter your comment for line ${lineNumber}`
    });
    if (comment) {
        const storageService = new StorageService();
        const filePath = activeEditor.document.uri.fsPath;
        storageService.saveComment(filePath, lineNumber, comment);
        vscode.window.showInformationMessage('Comment added successfully!');
    } else {
        vscode.window.showWarningMessage('Comment cannot be empty.');
    }
}