/**
 * Show Comment command – display the note for the current line in a notification.
 *
 * @author Gobinda Nandi <gobinda.nandi.public@gmail.com>
 * @since 0.0.1 [25-04-2025]
 * @version 1.1.1
 * @copyright (c) 2025 Gobinda Nandi
 */

import * as vscode from 'vscode';
import { StorageService } from "./../services/storageService";
import { formatCommentDate } from '../formatComment';

/**
 * Shows the comment at the current line in an information message (with timestamp if set).
 *
 * @returns {Promise<void>}
 * @version 1.1.1
 */
export async function showComment(): Promise<void> {
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
                const datePart = comment.updatedAt ? ` (${formatCommentDate(comment.updatedAt)})` : '';
                vscode.window.showInformationMessage(`Comment on line ${lineNumber}: ${comment.text}${datePart}`);
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