import * as vscode from 'vscode';
import { StorageService } from "./../services/storageService";

export async function showComment() {
    const lineNumber = await vscode.window.showInputBox({
        prompt: 'Enter the line number to view the comment'
    });

    if (lineNumber) {
        const storageService = new StorageService();
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor) {
            const filePath = activeEditor.document.uri.fsPath;
            const comment = storageService.getComment(filePath, parseInt(lineNumber));
            if (comment) {
                vscode.window.showInformationMessage(`Comment on line ${lineNumber}: ${comment}`);
            } else {
                vscode.window.showWarningMessage(`No comment found on line ${lineNumber}.`);
            }
        } else {
            vscode.window.showErrorMessage('No active editor found.');
        }
    } else {
        vscode.window.showWarningMessage('Line number cannot be empty.');
    }
}