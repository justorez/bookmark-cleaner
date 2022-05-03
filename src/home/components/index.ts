import { App } from 'vue'
import {
    ElConfigProvider,
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
    ElLink,
    ElTooltip,
    ElIcon,
    ElSpace
} from 'element-plus'
import { Edit, Delete, Remove, Refresh, Minus } from '@element-plus/icons-vue'

export default {
    install(app: App) {
        app.use(ElConfigProvider)
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
        app.use(ElLink)
        app.use(ElTooltip)
        app.use(ElIcon)
        app.use(ElSpace)
        app.component(Edit.name, Edit)
        app.component(Delete.name, Delete)
        app.component(Remove.name, Remove)
        app.component(Refresh.name, Refresh)
        app.component(Minus.name, Minus)
    }
}
