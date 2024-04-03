import { Bookmark, InvalidBookmark, ElTableInstance } from "../interface"
import { checkURL } from "../utils/check"
import whitelist from "../utils/whitelist"

export interface UseTableOptions {
    bookmarks: Ref<Bookmark[]>
    invalidBookmarks: Ref<InvalidBookmark[]>
    checkStartIndex: Ref<number>
}
export function useTable(options: UseTableOptions) {
    const tableComponent = ref(null)
    const page = reactive({
        current: 1,
        size: 10,
        total: 0
    })
    const tableData = ref<InvalidBookmark[]>([])
    const tableLoading = ref(false)
    const selectedData = ref<InvalidBookmark[]>([])
    const { bookmarks, invalidBookmarks, checkStartIndex } = options
    const clearDisabled = computed(() => invalidBookmarks.value.length === 0)
    const clearButtonTitle = computed(() => {
        return clearDisabled.value ? '暂无失效书签可以清理' : ''
    })
    const clearSelectedDisabled = computed(() => selectedData.value.length === 0)
    const isPageSelected = computed(() => {
        return tableData.value.length > 0 && 
                selectedData.value.length === tableData.value.length
    })

    function query() {
        tableData.value = invalidBookmarks.value.slice(
            (page.current - 1) * page.size,
            page.current * page.size
        )
        page.total = invalidBookmarks.value.length
    }

    function handleSizeChange() {
        page.current = 1
        query()
    }

    function reset() {
        page.current = 1
        page.size = 10
        page.total = 0
        tableData.value = []
    }

    function selectPage() {
        if (tableComponent.value) {
            (tableComponent.value as ElTableInstance).toggleAllSelection()
        }
    }

    function handleSelectionChange(val: InvalidBookmark[]) {
        selectedData.value = val
    }

    function del(data: InvalidBookmark | InvalidBookmark[]) {
        if (!Array.isArray(data)) {
            data = [data]
        }

        for (const item of data) {
            chrome.bookmarks.remove(item.id)
            checkStartIndex.value--
        }

        const ids = data.map((item) => item.id)
        bookmarks.value = bookmarks.value.filter(
            (item) => !ids.includes(item.id)
        )
        invalidBookmarks.value = invalidBookmarks.value.filter(
            (item) => !ids.includes(item.id)
        )
        query()
    }

    function ignore(data: InvalidBookmark | InvalidBookmark[], flag = true) {
        if (!Array.isArray(data)) {
            data = [data]
        }

        let ids: string[] = [],
            urls = []
        for (const item of data) {
            checkStartIndex.value--
            ids.push(item.id)
            item.url && urls.push(item.url)
        }

        flag && whitelist.add(urls)
        bookmarks.value = bookmarks.value.filter(
            (item) => !ids.includes(item.id)
        )
        invalidBookmarks.value = invalidBookmarks.value.filter(
            (item) => !ids.includes(item.id)
        )
        query()
    }

    function changeURL(row: InvalidBookmark) {
        if (!row.url) {
            ElMessage.warning('链接不能为空！')
            row.url = bookmarks.value.find(x => x.id === row.id)?.url
            return
        }

        chrome.bookmarks.update(row.id, { url: row.url })
        
        tableLoading.value = true
        checkURL(row.url, 10)
            .then(() => {
                ElMessage.success('新链接有效~')
                row.error = new Error('---')
                ignore(row, false)
            })
            .catch(error => {
                row.error = error
            })
            .finally(() => {
                tableLoading.value = false
                row.editing = false
            })
    }

    async function clearSelected() {
        try {
            await ElMessageBox.confirm('确定清理选中的书签吗？', '提示', {
                type: 'info',
            })
            del(selectedData.value)
        } catch (error) { }
    }

    async function clear() {
        try {
            await ElMessageBox.confirm('清理前最好备份一下哦~，点击确定开始清理', '提示', {
                type: 'info',
            })
            del(invalidBookmarks.value)
        } catch (error) { }
    }

    return {
        page,
        tableData,
        selectedData,
        tableComponent,
        tableLoading,
        isPageSelected,
        clearDisabled,
        clearButtonTitle,
        clearSelectedDisabled,
        query,
        handleCurrentChange: query,
        handleSizeChange,
        resetTable: reset,
        selectPage,
        handleSelectionChange,
        deleteBookmark: del,
        ignore,
        changeURL,
        clear,
        clearSelected
    }
}