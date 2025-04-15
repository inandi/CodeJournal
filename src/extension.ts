import * as vscode from 'vscode';
import { addComment } from "./commands/addComment"
import { updateComment } from "./commands/updateComment";
import { deleteComment } from "./commands/deleteComment";
import { showComment } from "./commands/showComment";

export function activate(context: vscode.ExtensionContext) {
    const addCommentCommand = vscode.commands.registerCommand('code-journal.addComment', addComment);
    const updateCommentCommand = vscode.commands.registerCommand('code-journal.updateComment', updateComment);
    const deleteCommentCommand = vscode.commands.registerCommand('code-journal.deleteComment', deleteComment);
    const showCommentCommand = vscode.commands.registerCommand('code-journal.showComment', showComment);

    context.subscriptions.push(addCommentCommand);
    context.subscriptions.push(updateCommentCommand);
    context.subscriptions.push(deleteCommentCommand);
    context.subscriptions.push(showCommentCommand);
}

export function deactivate() {}