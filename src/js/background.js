import Scheduler from './scheduler.js'
import { checkURL } from './check.js'

const App = {
    data() {
        return {
            showProgress: false,
            percentage: 0,
            timeout: 10,
            checkLoading: false,
            checkStartIndex: 0,
            bookmarks: [],
            invalidBookmarks:[],
            tableData: [],
            currentPage: 1,
            pageSize: 10,
            total: 0,
            tableLoading: false,
            scheduler: null,
            selectedData: []
        }
    },
    computed: {
        checkButtonText() {
            const start = this.checkStartIndex
            return this.checkLoading ? '检测中...'
                : start === 0 ? '开始检测' : '继续检测'
        },
        clearDisabled() {
            return this.invalidBookmarks.length === 0
        },
        clearButtonTitle() {
            return this.clearDisabled ? '暂无失效书签可以清理' : ''
        },
        clearSelectedDisabled() {
            return this.selectedData.length === 0
        },
        isPageSelected() {
            return this.tableData.length > 0 && 
                this.selectedData.length === this.tableData.length
        }
    },
    watch: {
        percentage(val) {
            const currentVal = Math.round(val)
            if (currentVal >= 100) {
                console.log('[check finished]', this.checkStartIndex)
                this.showProgress = false
                this.checkLoading = false
                this.checkStartIndex = 0
                this.percentage = 0
                this.queryList()
            }
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            chrome.bookmarks.getTree(tree => {
                // console.log(tree[0])
                this.getBookmarks(tree[0])
            })
            this.scheduler = new Scheduler(10)
        },
        getBookmarks(node, path = []) {
            if (node.title && !['1', '2'].includes(node.id)) {
                path.push(node.title)
            }

            if (!node.children) {
                this.bookmarks.push({ 
                    ...node, 
                    path: [...path] // 若直接使用 path，由于指向的都是同一个数组，递归结束，数组为空
                })
                path.pop()
                return
            }
            
            for (const _node of node.children) {
                this.getBookmarks(_node, path)
            }
            path.pop()
        },
        queryList() {
            this.tableData = this.invalidBookmarks.slice(
                (this.currentPage - 1) * this.pageSize,
                this.currentPage * this.pageSize
            )
            this.total = this.invalidBookmarks.length
        },
        handleCurrentChange() {
            this.queryList()
        },
        handleSizeChange() {
            this.currentPage = 1
            this.queryList()
        },
        resetList() {
            this.currentPage = 1
            this.pageSize = 10
            this.tableData = []
            this.total = 0
        },
        startCheck() {
            const list = this.bookmarks.slice(this.checkStartIndex)
            const step = 100 / this.bookmarks.length
            console.log('[startCheck]', this.checkStartIndex, step)
            this.showProgress = true
            this.checkLoading = true
            for (const item of list) {
                this.scheduler.add(() => checkURL(item.url, this.timeout))
                    .catch(error => {
                        this.invalidBookmarks.push({
                            ...item,
                            error
                        })
                    })
                    .finally(() => {
                        this.checkStartIndex += 1
                        this.percentage += step
                    })
            }
        },
        stopCheck() {
            console.log('[stopCheck]', this.checkStartIndex, this.bookmarks.length)
            this.scheduler.clear()
            this.showProgress = false
            this.checkLoading = false
            this.queryList()
        },
        resetCheck() {
            this.scheduler.clear()
            this.timeout = 10
            this.invalidBookmarks = []
            this.checkStartIndex = 0
            this.percentage = 0
            this.showProgress = false
            this.checkLoading = false
            this.resetList()
        },
        deleteOne(item) {
            chrome.bookmarks.remove(item.id, () => {
                this.ignore(item)
            })
        },
        deleteList(list) {
            for (const item of list) {
                chrome.bookmarks.remove(item.id)
            }
            this.ignore(list)
        },
        ignore(data, flush = true) {
            if (!Array.isArray(data)) {
                data = [ data ]
            }
            const ids = data.map(item => item.id)
            this.bookmarks = this.bookmarks.filter(item => !ids.includes(item.id))
            this.invalidBookmarks = this.invalidBookmarks.filter(item => !ids.includes(item.id))
            flush && this.queryList()
        },
        async clearAll() {
            try {
                await this.$confirm('清理前最好备份一下哦~，点击确定开始清理', '提示', {
                    type: 'info',
                })
                this.deleteList(this.invalidBookmarks)
                this.resetCheck()
            } catch (error) {
                
            }
        },
        async clearSelected() {
            try {
                await this.$confirm('确定清理选中的书签吗？', '提示', {
                    type: 'info',
                })
                this.deleteList(this.selectedData)
            } catch (error) {
                
            }
        },
        selectPage() {
            this.$refs.tableComp.toggleAllSelection()
        },
        handleSelectionChange(val) {
            this.selectedData = val
        },
        formatProgress(percentage) {
            return percentage >= 100 ? '100%' : `${Number(percentage).toFixed(2)}%`
        }
    }
}

const app = Vue.createApp(App)
app.use(ElementPlus, {
    locale: ElementPlusLocaleZhCn
})
app.mount("#app")