/**
 * Status bar item and "Show in status bar" toggle. Click opens Code Journal quick-pick menu.
 *
 * @author Gobinda Nandi <gobinda.nandi.public@gmail.com>
 * @since 1.1.1 [27-02-2026]
 * @version 1.1.1
 * @copyright (c) 2026 Gobinda Nandi
 */

import * as vscode from 'vscode';
import { isHighlightsEnabled } from './commands/toggleCommentHighlights';

const STATUS_BAR_KEY = 'codejournal.statusBarVisible';

let statusBarItem: vscode.StatusBarItem | undefined;
let extensionContext: vscode.ExtensionContext;

function isVisible(): boolean {
	return extensionContext.globalState.get<boolean>(STATUS_BAR_KEY, false);
}

/**
 * Initializes the status bar item and restores visibility from global state.
 *
 * @param {vscode.ExtensionContext} context - Extension context for global state
 * @returns {void}
 * @version 1.1.1
 */
export function initStatusBar(context: vscode.ExtensionContext): void {
	extensionContext = context;
	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	updateVisibility();
	statusBarItem.command = 'codejournal.showCodeJournalMenu';
	context.subscriptions.push(statusBarItem);
	vscode.commands.executeCommand('setContext', 'codejournal.statusBarVisible', isVisible());
}

function updateVisibility(): void {
	if (!statusBarItem) {
		return;
	}
	if (isVisible()) {
		statusBarItem.text = 'CodeJournal';
		statusBarItem.show();
	} else {
		statusBarItem.hide();
	}
}

/**
 * Toggles "Show in status bar" and updates global state and context.
 *
 * @returns {void}
 * @version 1.1.1
 */
export function toggleStatusBar(): void {
	const next = !isVisible();
	extensionContext.globalState.update(STATUS_BAR_KEY, next);
	vscode.commands.executeCommand('setContext', 'codejournal.statusBarVisible', next);
	updateVisibility();
}

/**
 * Shows the Code Journal quick-pick menu (same actions as context menu except "Show in status bar").
 *
 * @returns {void}
 * @version 1.1.1
 */
export function showCodeJournalMenu(): void {
	const items: vscode.QuickPickItem[] = [
		{ label: 'Add Comment', description: '', detail: 'Add a note to the current line' },
		{ label: 'Update Comment', description: '', detail: 'Edit the note on the current line' },
		{ label: 'Delete Comment', description: '', detail: 'Remove the note from the current line' },
		{ label: 'Show Comment', description: '', detail: 'Show the note for the current line' },
	];
	if (isHighlightsEnabled()) {
		items.push({ label: 'Highlight Comments [on]', description: '', detail: 'Turn off gutter markers and View comment' });
	} else {
		items.push({ label: 'Highlight Comments [off]', description: '', detail: 'Turn on gutter markers and View comment' });
	}

	vscode.window.showQuickPick(items, {
		placeHolder: 'Code Journal',
		title: 'Code Journal',
	}).then((selected) => {
		if (!selected) {
			return;
		}
		const commandMap: Record<string, string> = {
			'Add Comment': 'codejournal.addComment',
			'Update Comment': 'codejournal.updateComment',
			'Delete Comment': 'codejournal.deleteComment',
			'Show Comment': 'codejournal.showComment',
			'Highlight Comments [on]': 'codejournal.highlightCommentsOn',
			'Highlight Comments [off]': 'codejournal.highlightCommentsOff',
		};
		const cmd = commandMap[selected.label];
		if (cmd) {
			vscode.commands.executeCommand(cmd);
		}
	});
}
