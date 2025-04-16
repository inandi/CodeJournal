import * as vscode from 'vscode';
import { StorageService } from "./../services/storageService";

export async function showComment() {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
        vscode.window.showErrorMessage('No active editor found.');
        return;
    }
    const lineNumber =  activeEditor.selection.active.line + 1;
    if (lineNumber) {
        const storageService = new StorageService();
        if (activeEditor) {
            const filePath = activeEditor.document.uri.fsPath;
            const comment = storageService.getComment(filePath, lineNumber);
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