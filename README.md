<div align="center">
  <h1>Code Journal [Beta]</h1>
  <p><strong>Personal notes at file and line level</strong></p>
</div>

Keep notes right where your code lives—without cluttering your files. Code Journal lets you attach comments to specific lines and keeps them in sync as you edit.

## What is Code Journal?

Code Journal is a VS Code extension that stores lightweight, personal notes attached to **specific files and line numbers** in your workspace. Comments live in a single JSON file (`.vscode/comments.json`) and never leave your machine.

## Why Use Code Journal?

- **Stay in context**: Notes are tied to the exact line—no hunting through a separate doc
- **Survives edits**: When you insert or delete lines, comment line numbers update automatically
- **Timestamps**: Each note stores a UTC date/time when added or updated; shown in tooltips and notifications
- **Private & local**: Everything is stored in your workspace; no cloud or account
- **Shareable**: Commit `.vscode/comments.json` to git to share notes with your team
- **Quick access**: Add, update, delete, or show comments from the editor context menu or the status bar

## Getting Started

### Installation

1. Open VS Code (or Cursor)
2. Go to the Extensions view
3. Search for **Code Journal**
4. Click **Install**

### First Steps

1. **Open a file** in your workspace
2. **Put the cursor** on the line you want to annotate
3. **Right‑click** in the editor and choose **Code Journal → Add Comment**
4. **Enter your note** in the input box and confirm
5. **Show it later**: Place the cursor on that line and choose **Code Journal → Show Comment**

## How It Works

### Adding a Comment

- Right‑click in the editor → **Code Journal → Add Comment**
- Enter the note in the prompt; it is saved for the **current file and line**
- If that line already has a comment, it is updated instead of creating a duplicate

### Updating a Comment

- Put the cursor on a line that has a comment
- Right‑click → **Code Journal → Update Comment**
- Edit the text in the input box; the stored note is updated in place

### Deleting a Comment

- Put the cursor on the line with the comment
- Right‑click → **Code Journal → Delete Comment**
- The note is removed from storage

### Showing a Comment

- Put the cursor on any line
- Right‑click → **Code Journal → Show Comment**
- If a note exists for that line, it appears in a VS Code notification (with UTC timestamp when available)

### Highlight Comments (gutter markers + CodeJournal: View Comment)

- Right‑click → **Code Journal → Highlight Comments [off]** to turn on (menu then shows **Highlight Comments [on]**)
- A **yellow marker** appears in the left gutter for every line that has a comment (temporary, like the debugger UI)
- A **"CodeJournal: View Comment"** link appears above each line with a comment—**click it** to see the note; **hover** to see a formatted tooltip with the comment text and **Updated** timestamp below
- When you **add** a comment with highlights on, the marker and link appear immediately; when you **delete** a comment, they disappear immediately
- Right‑click → **Code Journal → Highlight Comments [on]** to turn off; gutter markers and View Comment lenses disappear

### Show in status bar

- Right‑click → **Code Journal → Show in status bar** (or **✓ Show in status bar** when already on) to show **CodeJournal** in the status bar
- **Click** the status bar item to open a quick-pick menu with the same Code Journal actions (Add/Update/Delete/Show Comment, Highlight [on/off])—without the “Show in status bar” option
- The choice is saved so it persists across sessions

### Keeping Track When the File Changes

- Comments are stored as **(file path, line number)** pairs plus an optional **`updatedAt`** UTC timestamp (set on add and update).
- **Insert or delete lines**: Code Journal adjusts stored line numbers so comments stay with the right line. If you delete a line that had a comment, that comment is removed.
- **Rename or move a file** (same workspace): Comments are moved to the new path automatically, so they stay with the file.
- **Delete a file**: That file’s comments are removed from storage so the journal doesn’t keep stale entries.
- Moving a block of code to another file does **not** move the comment—comments stay tied to the line number in the current file.

### Storage Location

Code Journal stores all comments in one file per workspace:

- **Path**: `.vscode/comments.json` in your workspace root
- The `.vscode` folder is created automatically if it doesn’t exist
- **Format**: JSON object keyed by workspace-relative file path (e.g. `src/extension.ts`), each value an array of `{ "line": number, "text": string, "updatedAt"?: string }` (UTC ISO timestamp when added/updated)

> **Note**: You can edit or back up `.vscode/comments.json` manually, or commit it to version control to share notes with others.

## Tips & Tricks

- Use **Show Comment** on any line to quickly check if you left a note there
- With **Highlight Comments** on, hover over **CodeJournal: View Comment** to see the note and its **Updated** timestamp in a formatted tooltip
- **Command Palette** (`Cmd+Shift+P` / `Ctrl+Shift+P`): search for “Code Journal” to run any command without the context menu
- Enable **Show in status bar** for one-click access to Code Journal actions from the status bar
- Comments are per line; multiple comments in one file are stored as separate entries in the array for that file

## Possible Future Improvements

- **Keybinding**: Assign a shortcut (e.g. `Ctrl+Alt+C`) to Add Comment or Show Comment in Keyboard Shortcuts.
- **Search / list**: A view or command to list or search all comments in the workspace and jump to the line.
- **Export**: Export comments to Markdown or plain text for backup or sharing outside the workspace.
- **Settings**: Options such as tooltip width, whether to show timestamp in notifications, or status bar alignment.
- **Bulk actions**: “Delete all comments in this file” or “Export all in workspace”.

## Known Issues

- Comments are anchored by line number only; moving code to another file does not move the comment
- If you upgraded from an older version that used a different path format, some comments might not appear; you may need to recreate them

## Support the Project

If Code Journal helps your workflow, you can support the author (no pressure):

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/igobinda)

## Need Help?

- **Issues**: Found a bug or have a feature request? Open an issue on GitHub
- **Development**: See `process.md` and `release.sh` for build and release workflow

## License

This project is licensed under the MIT License. See `LICENSE` for details.

---

**Made with ❤️ by Gobinda Nandi**
