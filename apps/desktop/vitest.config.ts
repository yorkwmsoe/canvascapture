import { configDefaults, defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
    test: {
        coverage: {
            provider: 'v8',
            exclude: [
                ...configDefaults.exclude,
                '**/out/**',
                '**/preload/**',
                '**/main/**',
                '**/types/**',
                '**/build/**',
                '**/*.api.ts',
                '**/command/categories.ts',
                '**/.eslintrc.js',
                '**/index.ts',
                '**/*.config.ts',
                '**/use*.ts',
                '**/*.route.ts',
                '**/*.store.ts',
                '**/*.d.ts',
                '**/utils/base-info.ts',
                '**/utils/config.ts',
                '**/utils/guards.ts',
                '**/generate.ts',
                '**/generate.v2.ts',
                '**/generateTOC.ts',
                '**/model.ts',
                '**/types.ts',
                '**/utils.ts',
                '**/*.e2e.ts',
                'wdio.conf.ts',
                '**/components/ErrorBoundary',
                '**/components/Generate',
                '**/components/icons',
                '**/components/MarkdownEditor/GUIEditor/EditableTable',
                '**/main.tsx',
                '**/pages/**',
                '**/providers/**',
            ],
        },
        reporters: ['default', 'junit'],
        outputFile: 'junit.xml',
        globals: true,
        environment: 'jsdom',
    },
    resolve: {
        alias: {
            '@renderer': path.resolve(__dirname, 'src/renderer/src'),
        },
    },
})
