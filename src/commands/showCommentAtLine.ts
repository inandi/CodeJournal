/**
 * Show Comment at Line – display comment in a message when CodeLens "View comment" is clicked.
 *
 * @author Gobinda Nandi <gobinda.nandi.public@gmail.com>
 * @since 1.1.1 [27-02-2026]
 * @version 1.1.1
 * @copyright (c) 2026 Gobinda Nandi
 */

import * as vscode from 'vscode';
import { formatCommentDate } from '../formatComment';

/**
 * Shows a Code Journal comment in a message box. Invoked from CodeLens click.
 * Arguments: [documentUri: string, lineNumber: number, commentText: string, updatedAt?: string]
 *
 * @param {...unknown[]} args - [uriStr, lineNumber, text, updatedAt]
 * @returns {Promise<void>}
 * @version 1.1.1
 */
export async function showCommentAtLine(...args: unknown[]): Promise<void> {
	const [uriStr, lineNumber, text, updatedAt] = args as [string, number, string, string | undefined];
	if (typeof uriStr !== 'string' || typeof lineNumber !== 'number' || typeof text !== 'string') {
		return;
	}
	const short = text.length > 200 ? text.slice(0, 200) + '…' : text;
	const datePart = updatedAt ? ` (${formatCommentDate(updatedAt)})` : '';
	vscode.window.showInformationMessage(`Code Journal (line ${lineNumber}): ${short}${datePart}`);
}
