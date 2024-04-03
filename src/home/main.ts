import { createApp } from 'vue'
import App from './app.vue'
import Icons from './components/icons'
import directives from './directives'
import 'element-plus/theme-chalk/src/message.scss'

// console.log(import.meta.env)
// console.log(process.env.NODE_ENV)

createApp(App)
    .use(Icons)
    .use(directives)
    .mount('#app')
