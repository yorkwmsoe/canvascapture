import { resolve } from 'path'
import {
    defineConfig,
    externalizeDepsPlugin,
    bytecodePlugin,
} from 'electron-vite'
import react from '@vitejs/plugin-react'
import renderer from 'vite-plugin-electron-renderer'
import * as process from 'node:process'

export default defineConfig(() => {
    if (process.env.NODE_ENV !== 'test') {
        process.env.ELECTRON_EXEC_PATH =
            '/usr/local/lib/node_modules/electron/dist'
    }

    return {
        main: {
            plugins: [externalizeDepsPlugin(), bytecodePlugin()],
        },
        preload: {
            plugins: [externalizeDepsPlugin(), bytecodePlugin()],
        },
        renderer: {
            define: {
                __APP_VERSION__: JSON.stringify(
                    process.env.npm_package_version
                ),
            },
            resolve: {
                alias: {
                    '@renderer': resolve('src/renderer/src'),
                },
            },
            // @ts-ignore - vite-plugin-electron-renderer is not yet typed
            plugins: [react(), renderer()],
        },
    }
})
