/**
 * CodeLens provider for "CodeJournal: View Comment" above lines with comments.
 * Lenses are shown only when Highlight Comments is on.
 *
 * @author Gobinda Nandi <gobinda.nandi.public@gmail.com>
 * @since 1.1.1 [27-02-2026]
 * @version 1.1.1
 * @copyright (c) 2026 Gobinda Nandi
 */

import * as vscode from 'vscode';
import { StorageService } from './services/storageService';
import { isHighlightsEnabled } from './commands/toggleCommentHighlights';
import { formatCommentTooltip } from './formatComment';

const codeLensChangeEmitter = new vscode.EventEmitter<void>();

/**
 * Returns a function that fires the CodeLens refresh event (used when comments or highlight state change).
 *
 * @returns {() => void} Refresh callback
 * @version 1.1.1
 */
export function getCodeLensRefresh(): () => void {
	return () => codeLensChangeEmitter.fire();
}

/**
 * Registers the CodeLens provider for workspace files. Lenses only appear when highlights are enabled.
 *
 * @returns {vscode.Disposable} Disposable to unregister the provider
 * @version 1.1.1
 */
export function registerCommentCodeLensProvider(): vscode.Disposable {
	const provider: vscode.CodeLensProvider = {
		onDidChangeCodeLenses: codeLensChangeEmitter.event,
		provideCodeLenses(
			document: vscode.TextDocument,
			_token: vscode.CancellationToken
		): vscode.CodeLens[] {
			if (!isHighlightsEnabled()) {
				return [];
			}
			const folder = vscode.workspace.getWorkspaceFolder(document.uri);
			if (!folder) {
				return [];
			}
			try {
				const comments = StorageService.getCommentsAt(
					folder.uri.fsPath,
					document.uri.fsPath
				);
				if (comments.length === 0) {
					return [];
				}
				return comments.map((c) => {
					const lineIndex = Math.max(0, c.line - 1);
					const range = new vscode.Range(lineIndex, 0, lineIndex, 0);
					return new vscode.CodeLens(range, {
						title: 'CodeJournal: View Comment',
						command: 'codejournal.showCommentAtLine',
						arguments: [document.uri.toString(), c.line, c.text, c.updatedAt],
						tooltip: formatCommentTooltip(c),
					});
				});
			} catch {
				return [];
			}
		},
	};
	return vscode.languages.registerCodeLensProvider({ scheme: 'file' }, provider);
}
