# Release v2.1.3 - 2026-04-07

## Bug Fixes
- Minor enhancements

---

# Release v2.1.2 - 2026-04-07

## Improvements
- Updated the extension display name branding in metadata from "Code Journal" to "Code's Journal".

---

# Release v2.1.1 - 2026-04-07

## New Features
- Added support in the release workflow to publish to both Visual Studio Marketplace and Open VSX Registry in a single release run.

## Improvements
- Added version consistency checks in the release workflow against `package.json` before publishing.
- Improved release-time validation and messaging for missing registry tokens and publish failures.
- Updated package dependencies, including ESLint-related packages, to newer versions.
- Added a preview flag in extension metadata for upcoming feature rollout.

---

# Release v1.1.7 - 2026-02-27

## New Features

- **Comments at file/line level**: Add, update, delete, and show personal notes attached to specific lines; stored in `.vscode/comments.json` per workspace.
- **Automatic line tracking**: When you insert or delete lines, comment line numbers are updated so notes stay with the code; comments on deleted lines are removed.
- **Highlight comments**: Gutter markers and CodeLens "CodeJournal: View Comment" link to quickly see notes; toggle via context menu.
- **Status bar**: Optional "CodeJournal" entry in the status bar with a quick-pick menu for Add/Update/Delete/Show Comment and Highlight on/off; preference is persisted.
- **Timestamps**: Optional `updatedAt` (UTC) on comments, shown in tooltips and notifications.
---
