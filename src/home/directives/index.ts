import { App } from 'vue'
import vFocus from './focus'

export default {
    install(app: App) {
        app.use(vFocus)
    }
}
