import { configDefaults, defineConfig } from 'vitest/config'
import { resolve } from 'C:\\Users\\evonichr\\WebstormProjects\\canvascapture\\canvas-capture'

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
                '**/*.tsx',
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
                '**/model.ts',
                '**/types.ts',
                '**/utils.ts',
                '**/*.e2e.ts',
                'wdio.conf.ts',
            ],
        },
        reporters: ['default', 'junit'],
        outputFile: 'junit.xml',
    },
})
