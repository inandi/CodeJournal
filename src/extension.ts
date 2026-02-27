/**
 * Code Journal Extension Entry Point
 *
 * Registers commands, CodeLens provider, status bar, and file/line change handlers
 * for storing and displaying per-line comments in the workspace.
 *
 * @author Gobinda Nandi <gobinda.nandi.public@gmail.com>
 * @since 0.0.1 [25-04-2025]
 * @version 1.1.1
 * @copyright (c) 2025 Gobinda Nandi
 */

import * as vscode from 'vscode';
import { addComment } from './commands/addComment';
import { updateComment } from './commands/updateComment';
import { deleteComment } from './commands/deleteComment';
import { showComment } from './commands/showComment';
import { showCommentAtLine } from './commands/showCommentAtLine';
import { toggleCommentHighlights, onActiveEditorChanged, refreshCommentHighlights, refreshActiveEditorHighlights, disposeHighlightDecoration, setCodeLensRefreshCallback, setCommentChangeCallback } from './commands/toggleCommentHighlights';
import { StorageService } from './services/storageService';
import { registerCommentCodeLensProvider, getCodeLensRefresh } from './commentCodeLensProvider';
import { initStatusBar, toggleStatusBar, showCodeJournalMenu } from './statusBar';

/**
 * Called when the extension is activated. Registers all commands and event handlers.
 *
 * @param {vscode.ExtensionContext} context - The extension context
 * @returns {void}
 * @version 1.1.1
 */
export function activate(context: vscode.ExtensionContext): void {
	const toggleFn = toggleCommentHighlights(context);
	context.subscriptions.push(
		vscode.commands.registerCommand('codejournal.addComment', addComment),
		vscode.commands.registerCommand('codejournal.updateComment', updateComment),
		vscode.commands.registerCommand('codejournal.deleteComment', deleteComment),
		vscode.commands.registerCommand('codejournal.showComment', showComment),
		vscode.commands.registerCommand('codejournal.showCommentAtLine', showCommentAtLine),
		vscode.commands.registerCommand('codejournal.toggleCommentHighlights', toggleFn),
		vscode.commands.registerCommand('codejournal.highlightCommentsOn', toggleFn),
		vscode.commands.registerCommand('codejournal.highlightCommentsOff', toggleFn),
		vscode.commands.registerCommand('codejournal.toggleStatusBar', toggleStatusBar),
		vscode.commands.registerCommand('codejournal.statusBarOn', toggleStatusBar),
		vscode.commands.registerCommand('codejournal.statusBarOff', toggleStatusBar),
		vscode.commands.registerCommand('codejournal.showCodeJournalMenu', showCodeJournalMenu)
	);

	initStatusBar(context);

	// CodeLens "View comment" only when highlights are on; refresh when toggling or when comments change
	setCodeLensRefreshCallback(getCodeLensRefresh());
	setCommentChangeCallback(() => {
		refreshActiveEditorHighlights(context);
		getCodeLensRefresh()();
	});
	context.subscriptions.push(registerCommentCodeLensProvider());

	vscode.commands.executeCommand('setContext', 'codejournal.highlightsOn', false);

	// When switching editor, re-apply comment highlights to the active file
	context.subscriptions.push(
		vscode.window.onDidChangeActiveTextEditor((editor) => {
			onActiveEditorChanged(editor ?? undefined, context);
		})
	);

	// When the user edits a file (insert/delete lines), adjust stored comment line numbers
	context.subscriptions.push(
		vscode.workspace.onDidChangeTextDocument((event) => {
			if (event.contentChanges.length === 0) {
				return;
			}
			const doc = event.document;
			if (doc.uri.scheme !== 'file') {
				return;
			}
			const folder = vscode.workspace.getWorkspaceFolder(doc.uri);
			if (!folder) {
				return;
			}
			try {
				const storage = new StorageService();
				storage.applyLineChanges(doc.uri.fsPath, event.contentChanges);
				// Refresh gutter markers so they stay on the right lines
				const active = vscode.window.activeTextEditor;
				if (active && active.document.uri.toString() === doc.uri.toString()) {
					refreshCommentHighlights(context);
				}
			} catch {
				// No workspace or storage not ready
			}
		})
	);

	// When a file is renamed or moved, move its comments to the new path (same workspace only)
	context.subscriptions.push(
		vscode.workspace.onDidRenameFiles((e) => {
			for (const { oldUri, newUri } of e.files) {
				if (oldUri.scheme !== 'file' || newUri.scheme !== 'file') {
					continue;
				}
				const folder = vscode.workspace.getWorkspaceFolder(newUri);
				if (!folder || folder !== vscode.workspace.getWorkspaceFolder(oldUri)) {
					continue;
				}
				try {
					StorageService.renameFileComments(
						folder.uri.fsPath,
						oldUri.fsPath,
						newUri.fsPath
					);
				} catch {
					// Ignore
				}
			}
		})
	);

	// When a file is deleted, remove its comments from storage
	context.subscriptions.push(
		vscode.workspace.onDidDeleteFiles((e) => {
			for (const uri of e.files) {
				if (uri.scheme !== 'file') {
					continue;
				}
				const folder = vscode.workspace.getWorkspaceFolder(uri);
				if (!folder) {
					continue;
				}
				try {
					StorageService.removeFileComments(folder.uri.fsPath, uri.fsPath);
				} catch {
					// Ignore
				}
			}
		})
	);
}

/**
 * Called when the extension is deactivated. Disposes gutter decoration resources.
 *
 * @returns {void}
 * @version 1.1.1
 */
export function deactivate(): void {
	disposeHighlightDecoration();
}
