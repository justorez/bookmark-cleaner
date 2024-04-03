<template>
    <el-config-provider :locale="zhCn">
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
            :status="percentage >= 100 ? 'success' : ''"
            :stroke-width="26"
            :percentage="percentage"
            :format="formatProgress"
        ></el-progress>

        <el-table
            :data="tableData"
            v-loading="tableLoading"
            strip
            :border="true"
            style="margin-top: 18px"
            @selection-change="handleSelectionChange"
            ref="tableComponent"
        >
            <el-table-column
                type="selection"
                width="55"
                :align="'center'"
            ></el-table-column>
            <el-table-column label="失效书签标题" show-overflow-tooltip>
                <template #default="{ row }">
                    {{ row.path.join(' / ') }}
                </template>
            </el-table-column>
            <el-table-column label="失效书签链接">
                <template #default="{ row }">
                    <div class="flex-box" v-show="row.editing">
                        <el-input
                            v-model="row.url"
                            v-focus
                            placeholder="请输入新的链接"
                            @keyup.enter="changeURL(row)"
                        ></el-input> &nbsp;
                        <el-button @click="row.editing=false">取消</el-button>
                    </div>
                    <div class="flex-box flex-box--end" v-show="!row.editing">
                        <el-link 
                            class="link-box" 
                            :href="row.url" 
                            target="_blank"
                        >
                            <span class="overflow">{{ row.url }}</span>
                        </el-link> &nbsp;
                        <el-button
                            class="icon-btn--inline"
                            type="text"
                            icon="edit"
                            title="编辑（回车保存）"
                            @click="row.editing=true"
                        ></el-button>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="error"
                label="错误信息"
                show-overflow-tooltip
            >
                <template #default="{ row }">
                    <el-link :underline="false" type="danger">
                        {{ row.error && row.error.message }}
                    </el-link>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-popconfirm
                        title="确定删除该书签吗？"
                        placement="top"
                        hide-icon
                        @confirm="deleteBookmark(row)"
                    >
                        <template #reference>
                            <el-button 
                                type="danger" 
                                icon="delete" 
                                plain 
                                circle
                                title="删除"
                            ></el-button>
                        </template>
                    </el-popconfirm>
                    <el-popconfirm
                        title="确定忽略该书签吗？"
                        placement="top"
                        hide-icon
                        @confirm="ignore(row)"
                    >
                        <template #reference>
                            <el-button 
                                type="primary" 
                                icon="minus" 
                                plain 
                                circle
                                title="忽略"
                            ></el-button>
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
                v-model:current-page="page.current"
                v-model:page-size="page.size"
                :page-sizes="[10, 20, 30]"
                :total="page.total"
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
export default { name: 'home' }
</script>
<script setup lang="ts">
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import { Bookmark } from './interface'
import Native from './utils/native'
import { useCheck } from './composables/useCheck'
import { useTable } from './composables/useTable'

const bookmarks = ref<Bookmark[]>([])

const { 
    timeout, 
    checkButtonText, 
    checkStartIndex, 
    checkLoading,
    showProgress,
    percentage,
    invalidBookmarks,
    start: startCheck,
    stop,
    reset,
    formatProgress 
} = useCheck({ bookmarks })

const {
    page,
    tableData,
    tableLoading,
    tableComponent,
    isPageSelected,
    clearDisabled,
    clearButtonTitle,
    clearSelectedDisabled,
    query,
    handleCurrentChange,
    handleSizeChange,
    resetTable,
    selectPage,
    handleSelectionChange,
    deleteBookmark,
    ignore,
    changeURL,
    clear,
    clearSelected
} = useTable({ bookmarks, checkStartIndex, invalidBookmarks })

onMounted(async () => {
    bookmarks.value = await Native.getBookmarks()

    // mock
    // const testNode = { 
    //     ...bookmarks.value[0],
    //     url: bookmarks.value[0].url?.repeat(2),
    //     error: new Error('Test Node')
    // }
    // tableData.value.push(testNode)
})

watch(percentage, (val) => {
    const currentVal = Math.round(val)
    if (currentVal >= 100) {
        console.log('[check finished]', checkStartIndex.value)
        showProgress.value = false
        checkLoading.value = false
        setTimeout(() => checkStartIndex.value = 0, 1000)
        percentage.value = 0
        query()
    }
})

function stopCheck() {
    stop()
    query()
}
function resetCheck() {
    reset()
    resetTable()
}

async function clearAll() {
    await clear()
    resetCheck()
}
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

.icon-btn--inline {
    height: auto;
    padding: 0;
    font-size: 18px;
}

.flex-box {
    display: flex;
    align-items: center;
    width: 90%;

    &--end {
        align-items: flex-end;
    }
   
    .el-button:last-child {
        flex-shrink: 0;
    }
}

.footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}
</style>
