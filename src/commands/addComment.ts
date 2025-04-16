import * as vscode from 'vscode';
import { StorageService } from "./../services/storageService";

export async function addComment() {
    const lineNumber = await vscode.window.showInputBox({
        prompt: 'Enter the line number to add a comment'
    });

    const comment = await vscode.window.showInputBox({
        prompt: 'Enter your comment'
    });

    if (lineNumber && comment) {
        const storageService = new StorageService();
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor) {
            const filePath = activeEditor.document.uri.fsPath;
            storageService.saveComment(filePath, parseInt(lineNumber), comment);
        } else {
            vscode.window.showErrorMessage('No active editor found.');
        }
        vscode.window.showInformationMessage('Comment added successfully!');
    } else {
        vscode.window.showWarningMessage('Line number and comment cannot be empty.');
    }
}