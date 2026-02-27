# Release v1.1.7 - 2026-02-27

## New Features

- **Comments at file/line level**: Add, update, delete, and show personal notes attached to specific lines; stored in `.vscode/comments.json` per workspace.
- **Automatic line tracking**: When you insert or delete lines, comment line numbers are updated so notes stay with the code; comments on deleted lines are removed.
- **Highlight comments**: Gutter markers and CodeLens "CodeJournal: View Comment" link to quickly see notes; toggle via context menu.
- **Status bar**: Optional "CodeJournal" entry in the status bar with a quick-pick menu for Add/Update/Delete/Show Comment and Highlight on/off; preference is persisted.
- **Timestamps**: Optional `updatedAt` (UTC) on comments, shown in tooltips and notifications.
---

