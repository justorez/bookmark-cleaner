import { ElTable } from "element-plus"

export interface Bookmark extends chrome.bookmarks.BookmarkTreeNode {
    path: Array<string>;
}

export interface InvalidBookmarks extends Bookmark {
    error: Error;
}

export type ElTableInstance = InstanceType<typeof ElTable>
