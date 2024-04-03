import path from 'path'
import { env } from 'process'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import buildNotifier from './.vite/plugins/rollup-plugin-notifier'
import { visualizer } from 'rollup-plugin-visualizer'

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
        AutoImport({
            resolvers: [ElementPlusResolver()],
            dts: 'types/auto-imports.d.ts'
        }),
        Components({
            resolvers: [ElementPlusResolver()],
            dts: 'types/components.d.ts'
        }),
        buildNotifier(),
        visualizer()
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
