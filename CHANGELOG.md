# Release v1.1.4 - 2026-02-27

## New Features

- **Highlight comments**: New commands to toggle comment highlighting; gutter markers and CodeLens "View Comment" above lines with notes.
- **Status bar**: Show Code Journal in the status bar with quick access to Add/Update/Delete/Show Comment and Highlight on/off.
- **Comment timestamps**: UTC timestamps on comments (stored and shown in tooltips/notifications).
- **Comment markers**: SVG icon for comment markers in the editor.

## Improvements

- **Storage service**: Improved handling of comment updates and line changes when editing files.
- **Commands**: Refactored to notify changes for better UI responsiveness when adding or removing comments.

---

# Release v1.1.3 - 2026-02-27

## New Features

- **Comments at file/line level**: Add, update, delete, and show personal notes attached to specific lines; stored in `.vscode/comments.json` per workspace.
- **Automatic line tracking**: When you insert or delete lines, comment line numbers are updated so notes stay with the code; comments on deleted lines are removed.
- **Highlight comments**: Gutter markers and CodeLens "CodeJournal: View Comment" link to quickly see notes; toggle via context menu.
- **Status bar**: Optional "CodeJournal" entry in the status bar with a quick-pick menu for Add/Update/Delete/Show Comment and Highlight on/off; preference is persisted.
- **Timestamps**: Optional `updatedAt` (UTC) on comments, shown in tooltips and notifications.

---

