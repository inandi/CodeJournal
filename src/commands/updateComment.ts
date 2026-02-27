/**
 * Update Comment command – edit the note on the current line.
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
 * Prompts with existing comment text and updates the note for the current line.
 *
 * @returns {Promise<void>}
 * @version 1.1.1
 */
export async function updateComment(): Promise<void> {
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
                notifyCommentChanged();
                vscode.window.showInformationMessage('Comment updated successfully!');
            }
        } else {
            vscode.window.showWarningMessage('No comment found on that line.');
        }
    }
}