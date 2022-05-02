import { App } from 'vue'
import { 
    ElConfigProvider,
    ElMain,
    ElForm,
    ElFormItem,
    ElLoading,
    ElTable,
    ElTableColumn,
    ElPagination,
    ElButton,
    ElProgress,
    ElPopconfirm,
    ElInput,
    ElInputNumber,
} from 'element-plus'

export function useElementPlus(app: App) {
    app.use(ElConfigProvider)
    app.use(ElMain)
    app.use(ElForm)
    app.use(ElFormItem)
    app.use(ElLoading)
    app.use(ElTable)
    app.use(ElTableColumn)
    app.use(ElPagination)
    app.use(ElButton)
    app.use(ElProgress)
    app.use(ElPopconfirm)
    app.use(ElInput)
    app.use(ElInputNumber)
}