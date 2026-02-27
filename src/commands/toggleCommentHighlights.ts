/**
 * Toggle and manage Highlight Comments (gutter markers + CodeLens visibility).
 *
 * @author Gobinda Nandi <gobinda.nandi.public@gmail.com>
 * @since 1.1.1 [27-02-2026]
 * @version 1.1.1
 * @copyright (c) 2026 Gobinda Nandi
 */

import * as vscode from 'vscode';
import { StorageService } from '../services/storageService';

let decorationType: vscode.TextEditorDecorationType | undefined;
let highlightsEnabled = false;
let lastDecoratedEditor: vscode.TextEditor | undefined;
let codeLensRefresh: (() => void) | null = null;

/**
 * Returns whether Highlight Comments (gutter + CodeLens) is currently on.
 *
 * @returns {boolean}
 * @version 1.1.1
 */
export function isHighlightsEnabled(): boolean {
	return highlightsEnabled;
}

/**
 * Sets the callback invoked when CodeLens should refresh (e.g. on toggle).
 *
 * @param {() => void} fn - Callback to fire
 * @returns {void}
 * @version 1.1.1
 */
export function setCodeLensRefreshCallback(fn: () => void): void {
	codeLensRefresh = fn;
}

let onCommentChangeCallback: (() => void) | null = null;

/**
 * Sets the callback invoked when a comment is added/updated/deleted (refresh gutter + CodeLens).
 *
 * @param {() => void} fn - Callback to fire
 * @returns {void}
 * @version 1.1.1
 */
export function setCommentChangeCallback(fn: () => void): void {
	onCommentChangeCallback = fn;
}

/**
 * Call after add/update/delete comment so gutter and CodeLens refresh.
 *
 * @returns {void}
 * @version 1.1.1
 */
export function notifyCommentChanged(): void {
	onCommentChangeCallback?.();
}

function getDecorationType(context: vscode.ExtensionContext): vscode.TextEditorDecorationType {
	if (!decorationType) {
		const iconPath = vscode.Uri.file(context.asAbsolutePath('media/comment-marker.svg'));
		decorationType = vscode.window.createTextEditorDecorationType({
			gutterIconPath: iconPath,
			gutterIconSize: 'contain',
		});
	}
	return decorationType;
}

function applyHighlights(editor: vscode.TextEditor, context: vscode.ExtensionContext): void {
	if (editor.document.uri.scheme !== 'file') {
		return;
	}
	try {
		const storage = new StorageService();
		const filePath = editor.document.uri.fsPath;
		const comments = storage.getComments(filePath);
		if (comments.length === 0) {
			editor.setDecorations(getDecorationType(context), []);
			return;
		}
		const ranges = comments.map((c) => {
			const line = Math.max(0, c.line - 1);
			return new vscode.Range(line, 0, line, 0);
		});
		editor.setDecorations(getDecorationType(context), ranges);
		lastDecoratedEditor = editor;
	} catch {
		editor.setDecorations(getDecorationType(context), []);
	}
}

/**
 * Returns the command handler that toggles Highlight Comments on/off for the active editor.
 *
 * @param {vscode.ExtensionContext} context - Extension context for decoration and assets
 * @returns {() => void} Command handler
 * @version 1.1.1
 */
export function toggleCommentHighlights(context: vscode.ExtensionContext): () => void {
	return () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showWarningMessage('No active editor.');
			return;
		}
		if (editor.document.uri.scheme !== 'file') {
			vscode.window.showWarningMessage('Comment highlights are only available for workspace files.');
			return;
		}
		const type = getDecorationType(context);
		if (highlightsEnabled) {
			if (lastDecoratedEditor) {
				lastDecoratedEditor.setDecorations(type, []);
			}
			lastDecoratedEditor = undefined;
			highlightsEnabled = false;
			vscode.window.showInformationMessage('Comment highlights off.');
		} else {
			applyHighlights(editor, context);
			highlightsEnabled = true;
			vscode.window.showInformationMessage('Comment highlights on.');
		}
		vscode.commands.executeCommand('setContext', 'codejournal.highlightsOn', highlightsEnabled);
		codeLensRefresh?.();
	};
}

/**
 * Re-applies gutter highlights to the newly active editor when highlights are on.
 *
 * @param {vscode.TextEditor | undefined} editor - New active editor
 * @param {vscode.ExtensionContext} context - Extension context
 * @returns {void}
 * @version 1.1.1
 */
export function onActiveEditorChanged(
	editor: vscode.TextEditor | undefined,
	context: vscode.ExtensionContext
): void {
	if (!highlightsEnabled) {
		return;
	}
	const type = getDecorationType(context);
	if (lastDecoratedEditor && lastDecoratedEditor !== editor) {
		lastDecoratedEditor.setDecorations(type, []);
	}
	if (editor && editor.document.uri.scheme === 'file') {
		applyHighlights(editor, context);
	} else {
		lastDecoratedEditor = undefined;
	}
}

/**
 * Refreshes gutter markers on the last decorated editor (e.g. after document line changes).
 *
 * @param {vscode.ExtensionContext} context - Extension context
 * @returns {void}
 * @version 1.1.1
 */
export function refreshCommentHighlights(context: vscode.ExtensionContext): void {
	if (!highlightsEnabled || !lastDecoratedEditor) {
		return;
	}
	applyHighlights(lastDecoratedEditor, context);
}

/**
 * Refreshes gutter markers in the active editor (e.g. after add/update/delete comment).
 *
 * @param {vscode.ExtensionContext} context - Extension context for decoration type
 * @returns {void}
 * @version 1.1.1
 */
export function refreshActiveEditorHighlights(context: vscode.ExtensionContext): void {
	if (!highlightsEnabled) {
		return;
	}
	const editor = vscode.window.activeTextEditor;
	if (!editor || editor.document.uri.scheme !== 'file') {
		return;
	}
	applyHighlights(editor, context);
}

/**
 * Disposes the gutter decoration type and resets state. Call on deactivate.
 *
 * @returns {void}
 * @version 1.1.1
 */
export function disposeHighlightDecoration(): void {
	if (decorationType) {
		decorationType.dispose();
		decorationType = undefined;
	}
	lastDecoratedEditor = undefined;
	highlightsEnabled = false;
}
