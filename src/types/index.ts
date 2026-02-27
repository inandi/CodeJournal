/**
 * Code Journal type definitions.
 *
 * @author Gobinda Nandi <gobinda.nandi.public@gmail.com>
 * @since 0.0.1 [25-04-2025]
 * @version 1.1.1
 * @copyright (c) 2025 Gobinda Nandi
 */

/**
 * Interface representing a single comment attached to a line.
 *
 * @interface Comment
 * @since 0.0.1 [25-04-2025]
 * @version 1.1.1
 */
export interface Comment {
    /** 1-based line number in the file */
    line: number;
    /** The note text */
    text: string;
    /** ISO 8601 UTC timestamp, set on add/update */
    updatedAt?: string;
}

/**
 * Interface for in-memory comment storage keyed by workspace-relative file path.
 *
 * @interface CommentStorage
 * @since 0.0.1 [25-04-2025]
 * @version 1.1.1
 */
export interface CommentStorage {
    [filePath: string]: Comment[];
}