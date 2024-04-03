import { App } from 'vue'
import { Edit, Delete, Remove, Refresh, Minus } from '@element-plus/icons-vue'

export default {
    install(app: App) {
        app.component(Edit.name, Edit)
        app.component(Delete.name, Delete)
        app.component(Remove.name, Remove)
        app.component(Refresh.name, Refresh)
        app.component(Minus.name, Minus)
    }
}
