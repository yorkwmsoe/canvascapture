import { configDefaults, defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
    test: {
        coverage: {
            provider: 'v8',
            exclude: [...configDefaults.exclude, '**/types/**', '**/build/**', '**/canvas_api/api.ts', '**/command/categories.ts', '**/.eslintrc.js', '**/index.ts', '**/cli.ts', '**/env.ts', '**/logger.ts'],
        },
        reporters: ['default', 'junit'],
        outputFile: 'junit.xml',
        alias: {
            '@': resolve(__dirname, './src'),
            '@modules': resolve(__dirname, './src/modules'),
            '@lib': resolve(__dirname, './src/lib'),
            '@constants': resolve(__dirname, './src/constants'),
        },
    },
})
