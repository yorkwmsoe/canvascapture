import { configDefaults, defineConfig } from 'vitest/config'
import { resolve } from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        coverage: {
            provider: 'v8',
            exclude: [...configDefaults.exclude, '**/types/**', '**/build/**', '**/canvas_api/api.ts', '**/command/categories.ts', '**/.eslintrc.js', '**/index.ts'],
        },
        reporters: ['junit'],
        outputFile: 'junit.xml',
        alias: {
            '@': resolve(__dirname, './src'),
            '@modules': resolve(__dirname, './src/modules'),
            '@lib': resolve(__dirname, './src/lib'),
            '@constants': resolve(__dirname, './src/constants'),
        },
    },
})
