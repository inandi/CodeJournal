/**
 * Delete Comment command – remove the note from the current line.
 *
 * @author Gobinda Nandi <gobinda.nandi.public@gmail.com>
 * @since 0.0.1 [25-04-2025]
 * @version 1.1.1
 * @copyright (c) 2025 Gobinda Nandi
 */

import * as vscode from 'vscode';
import { StorageService } from './../services/storageService';
import { notifyCommentChanged } from './toggleCommentHighlights';

/**
 * Deletes the comment at the current line and notifies so gutter/CodeLens refresh.
 *
 * @returns {Promise<void>}
 * @version 1.1.1
 */
export async function deleteComment(): Promise<void> {
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
    notifyCommentChanged();
    vscode.window.showInformationMessage(`Comment deleted from line: ${lineNumber}`);
}