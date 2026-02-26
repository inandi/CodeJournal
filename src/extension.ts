import * as vscode from 'vscode';
import { addComment } from './commands/addComment';
import { updateComment } from './commands/updateComment';
import { deleteComment } from './commands/deleteComment';
import { showComment } from './commands/showComment';
import { StorageService } from './services/storageService';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('codejournal.addComment', addComment),
		vscode.commands.registerCommand('codejournal.updateComment', updateComment),
		vscode.commands.registerCommand('codejournal.deleteComment', deleteComment),
		vscode.commands.registerCommand('codejournal.showComment', showComment)
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
			} catch {
				// No workspace or storage not ready
			}
		})
	);
}
