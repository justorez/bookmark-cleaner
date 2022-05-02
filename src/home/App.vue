<template>
    <el-config-provider :locale="locale">
        <el-form inline>
            <el-form-item label="链接最长等待时间（秒）">
                <el-input-number v-model="timeout" :min="1" :controls="false" />
            </el-form-item>
            <el-form-item>
                <el-button :loading="checkLoading" @click="startCheck">{{
                    checkButtonText
                }}</el-button>
                <el-button @click="stopCheck">停止检测</el-button>
                <el-button @click="resetCheck">重置</el-button>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="danger"
                    plain
                    :disabled="clearSelectedDisabled"
                    @click="clearSelected"
                    >清理选中的书签</el-button
                >
                <el-button
                    type="danger"
                    plain
                    :disabled="clearDisabled"
                    :title="clearButtonTitle"
                    @click="clearAll"
                    >一键清理失效书签</el-button
                >
            </el-form-item>
        </el-form>

        <el-progress
            v-show="showProgress"
            text-inside
            status="success"
            :stroke-width="26"
            :percentage="percentage"
            :format="formatProgress"
        ></el-progress>

        <el-table
            :data="tableData"
            v-loading="tableLoading"
            strip
            border
            style="margin-top: 18px"
            @selection-change="handleSelectionChange"
            ref="tableComp"
        >
            <el-table-column
                type="selection"
                width="55"
                align="center"
            ></el-table-column>
            <el-table-column label="失效书签标题" show-overflow-tooltip>
                <template #default="{ row }">
                    {{ row.path.join(' / ') }}
                </template>
            </el-table-column>
            <el-table-column label="失效书签链接">
                <template #default="{ row }">
                    <el-link class="link-box" :href="row.url" target="_blank">
                        <span class="overflow">{{ row.url }}</span>
                    </el-link>
                </template>
            </el-table-column>
            <el-table-column
                prop="error"
                label="错误信息"
                show-overflow-tooltip
            >
                <template #default="{ row }">
                    <el-link :underline="false" type="danger">
                        {{ row.error.message }}
                    </el-link>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-popconfirm
                        title="确定删除该书签吗？"
                        placement="top"
                        hide-icon
                        @confirm="deleteOne(row)"
                    >
                        <template #reference>
                            <el-button type="danger" plain>删除</el-button>
                        </template>
                    </el-popconfirm>
                    <el-popconfirm
                        title="确定忽略该书签吗？"
                        placement="top"
                        hide-icon
                        @confirm="ignore(row)"
                    >
                        <template #reference>
                            <el-button type="success" plain>忽略</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <div class="footer">
            <el-button @click="selectPage">
                {{ isPageSelected ? '取消全选' : '全选当前页' }}
            </el-button>
            <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="[10, 20, 30]"
                :total="total"
                background
                layout="->, total, sizes, prev, pager, next, jumper"
                style="margin-top: 18px"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
            ></el-pagination>
        </div>
    </el-config-provider>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import Scheduler from './utils/scheduler'
import { checkURL } from './utils/check'
import { Bookmark, ElTableInstance, InvalidBookmarks } from './interface'
import { ElMessageBox } from 'element-plus'

export default defineComponent({
    name: 'home',
    data() {
        return {
            locale: zhCn,
            showProgress: false,
            percentage: 0,
            timeout: 10,
            checkLoading: false,
            checkStartIndex: 0,
            bookmarks: [] as Bookmark[],
            invalidBookmarks:[] as InvalidBookmarks[],
            tableData: [] as InvalidBookmarks[],
            currentPage: 1,
            pageSize: 10,
            total: 0,
            tableLoading: false,
            scheduler: new Scheduler(10),
            selectedData: [] as InvalidBookmarks[]
        }
    },
    computed: {
        checkButtonText(): string {
            const start = this.checkStartIndex
            return this.checkLoading ? '检测中...'
                : start === 0 ? '开始检测' : '继续检测'
        },
        clearDisabled(): boolean {
            return this.invalidBookmarks.length === 0
        },
        clearButtonTitle(): string {
            return this.clearDisabled ? '暂无失效书签可以清理' : ''
        },
        clearSelectedDisabled(): boolean {
            return this.selectedData.length === 0
        },
        isPageSelected(): boolean {
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
                setTimeout(() => this.checkStartIndex = 0, 1000)
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
        },
        getBookmarks(node: chrome.bookmarks.BookmarkTreeNode, path:string[] = []) {
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
        deleteOne(item: InvalidBookmarks) {
            chrome.bookmarks.remove(item.id, () => {
                this.ignore(item)
            })
        },
        deleteList(list: InvalidBookmarks[]) {
            for (const item of list) {
                chrome.bookmarks.remove(item.id)
            }
            this.ignore(list)
        },
        ignore(data: InvalidBookmarks | InvalidBookmarks[], flush = true) {
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
                await ElMessageBox.confirm('清理前最好备份一下哦~，点击确定开始清理', '提示', {
                    type: 'info',
                })
                this.deleteList(this.invalidBookmarks)
                this.resetCheck()
            } catch (error) {
                
            }
        },
        async clearSelected() {
            try {
                await ElMessageBox.confirm('确定清理选中的书签吗？', '提示', {
                    type: 'info',
                })
                this.deleteList(this.selectedData)
            } catch (error) {
                
            }
        },
        selectPage() {
            if (this.$refs && this.$refs.tableComp) {
                (this.$refs.tableComp as ElTableInstance).toggleAllSelection()
            }
        },
        handleSelectionChange(val: InvalidBookmarks[]) {
            this.selectedData = val
        },
        formatProgress(percentage: number) {
            return percentage >= 100 ? '100%' : `${Number(percentage).toFixed(2)}%`
        }
    }
})
</script>

<style lang="less">
[v-cloak] {
    display: none;
}

body {
    margin: 0;
    padding: 20px;
}

::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}
::-webkit-scrollbar-thumb {
    background-color: #0003;
    border-radius: 10px;
    transition: all .2s ease-in-out;
}
::-webkit-scrollbar-track {
    border-radius: 10px;
}

.link-box {
    max-width: 100%;
}

.link-box .el-link__inner {
    overflow: hidden;
}

.overflow {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}
</style>
