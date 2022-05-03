import { ElTable } from "element-plus"

export interface Bookmark extends chrome.bookmarks.BookmarkTreeNode {
    path: Array<string>
    editing: boolean
}

export interface InvalidBookmarks extends Bookmark {
    error: Error
}

export type ElTableInstance = InstanceType<typeof ElTable>
