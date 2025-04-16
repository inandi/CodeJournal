import * as vscode from 'vscode';
import { addComment } from "./commands/addComment";
import { updateComment } from "./commands/updateComment";
import { deleteComment } from "./commands/deleteComment";
import { showComment } from "./commands/showComment";

export function activate(context: vscode.ExtensionContext) {
    const addCommentCommand = vscode.commands.registerCommand('codejournal.addComment', addComment);
    const updateCommentCommand = vscode.commands.registerCommand('codejournal.updateComment', updateComment);
    const deleteCommentCommand = vscode.commands.registerCommand('codejournal.deleteComment', deleteComment);
    const showCommentCommand = vscode.commands.registerCommand('codejournal.showComment', showComment);

    context.subscriptions.push(addCommentCommand);
    context.subscriptions.push(updateCommentCommand);
    context.subscriptions.push(deleteCommentCommand);
    context.subscriptions.push(showCommentCommand);
}

export function deactivate() {}