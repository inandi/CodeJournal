/**
 * Add Comment command – save a note for the current line.
 *
 * @author Gobinda Nandi <gobinda.nandi.public@gmail.com>
 * @since 0.0.1 [25-04-2025]
 * @version 1.1.1
 * @copyright (c) 2025 Gobinda Nandi
 */

import * as vscode from 'vscode';
import { StorageService } from "./../services/storageService";
import { notifyCommentChanged } from './toggleCommentHighlights';

/**
 * Prompts for comment text and saves it for the active editor's current line.
 * Notifies so gutter and CodeLens refresh when highlights are on.
 *
 * @returns {Promise<void>}
 * @version 1.1.1
 */
export async function addComment(): Promise<void> {
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
        notifyCommentChanged();
        vscode.window.showInformationMessage('Comment added successfully!');
    } else {
        vscode.window.showWarningMessage('Comment cannot be empty.');
    }
}