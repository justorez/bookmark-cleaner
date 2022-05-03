import path from 'path'
import { env } from 'process'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ElementPlus from 'unplugin-element-plus/vite'

const isDev = env.MODE === 'dev'
const resolve = (dest) => path.resolve(__dirname, dest)

// https://cn.vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@': resolve('src')
        }
    },
    plugins: [
        vue(),
        ElementPlus()
    ],
    build: {
        minify: isDev ? false : 'esbuild',
        rollupOptions: {
            input: {
                popup: resolve('index.html'),
                home: resolve('src/home.html'),
                background: resolve('src/background.ts')
            }
        }
    }
})
