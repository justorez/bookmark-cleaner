import { createApp } from 'vue'
import App from './app.vue'
import myComponents from './components'
import myDirectives from './directives'

// console.log(import.meta.env)
// console.log(process.env.NODE_ENV)

createApp(App)
    .use(myComponents)
    .use(myDirectives)
    .mount('#app')
