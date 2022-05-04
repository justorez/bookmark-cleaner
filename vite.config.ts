import path from 'path'
import { env } from 'process'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ElementPlus from 'unplugin-element-plus/vite'
import buildNotifier from './.vite/plugins/rollup-plugin-notifier'

const isProd = env.MODE === 'prod'
const resolve = (dest) => path.resolve(__dirname, dest)

// https://cn.vitejs.dev/config/
export default defineConfig({
    mode: isProd ? 'production' : 'development',
    resolve: {
        alias: {
            '@': resolve('src')
        }
    },
    plugins: [
        vue(),
        ElementPlus(),
        buildNotifier()
    ],
    build: {
        sourcemap: !isProd,
        minify: isProd ? 'esbuild' : false,
        rollupOptions: {
            input: {
                popup: resolve('index.html'),
                home: resolve('src/home/index.html')
            }
        }
    }
})
