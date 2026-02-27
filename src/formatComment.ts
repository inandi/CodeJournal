/**
 * Comment formatting utilities for display and tooltips.
 *
 * @author Gobinda Nandi <gobinda.nandi.public@gmail.com>
 * @since 1.1.1 [27-02-2026]
 * @version 1.1.1
 * @copyright (c) 2026 Gobinda Nandi
 */

import type { Comment } from './types';

const TOOLTIP_WIDTH = 44;
const TOOLTIP_LINE = '─'.repeat(TOOLTIP_WIDTH - 2); // with "  " prefix = TOOLTIP_WIDTH

/**
 * Formats a UTC ISO string for display (e.g. "27 Feb 2026, 12:34 UTC").
 *
 * @param {string} [iso] - ISO 8601 date string
 * @returns {string} Formatted date string or empty if missing
 * @version 1.1.1
 */
export function formatCommentDate(iso?: string): string {
	if (!iso) {
		return '';
	}
	try {
		const d = new Date(iso);
		const date = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
		const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
		return `${date}, ${time} UTC`;
	} catch {
		return iso;
	}
}

/**
 * Returns comment text with an "Updated: ..." line when updatedAt is set.
 *
 * @param {Comment} comment - Comment object
 * @returns {string} Text plus optional date line
 * @version 1.1.1
 */
export function formatCommentWithDate(comment: Comment): string {
	const dateLine = comment.updatedAt ? `\nUpdated: ${formatCommentDate(comment.updatedAt)}` : '';
	return comment.text + dateLine;
}

/**
 * Word-wraps text to a maximum line length.
 *
 * @private
 * @param {string} text - Text to wrap
 * @param {number} maxLen - Max characters per line
 * @returns {string[]} Array of lines
 * @version 1.1.1
 */
function wrapText(text: string, maxLen: number): string[] {
	const lines: string[] = [];
	let remaining = text;
	while (remaining.length > 0) {
		if (remaining.length <= maxLen) {
			lines.push(remaining.trimEnd());
			break;
		}
		const chunk = remaining.slice(0, maxLen);
		const lastSpace = chunk.lastIndexOf(' ');
		const breakAt = lastSpace > 0 ? lastSpace + 1 : maxLen;
		lines.push(remaining.slice(0, breakAt).trimEnd());
		remaining = remaining.slice(breakAt).trimStart();
	}
	return lines;
}

/**
 * Formats comment for CodeLens tooltip: title, separator, message, then timestamp below.
 *
 * @param {Comment} comment - Comment object
 * @returns {string} Formatted tooltip string
 * @version 1.1.1
 */
export function formatCommentTooltip(comment: Comment): string {
	const bodyLines = wrapText(comment.text, TOOLTIP_WIDTH - 2).map((line) => '  ' + line);
	const parts = [
		'  Code Journal',
		'  ' + TOOLTIP_LINE,
		'',
		...bodyLines,
		'',
	];
	if (comment.updatedAt) {
		parts.push('  ' + TOOLTIP_LINE);
		parts.push('  Updated: ' + formatCommentDate(comment.updatedAt));
	}
	return parts.join('\n');
}
