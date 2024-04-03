import { env } from 'node:process'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import buildNotifier from './.vite/plugins/rollup-plugin-notifier'
import { visualizer } from 'rollup-plugin-visualizer'

const isProd = env.NODE_ENV === 'production'
const resolve = (p: string) => fileURLToPath(new URL(p, import.meta.url))

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
            imports: ['vue'],
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
