import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        coverage: {
            provider: 'v8',
            exclude: [
                ...configDefaults.exclude,
                '**/types/**',
                '**/index.ts',
                '**/*.types.ts',
                '**/entity/**',
            ],
        },
        reporters: ['default', 'junit'],
        outputFile: 'junit.xml',
        setupFiles: ['./src/tests/canvas.api.setup.ts'],
    },
})
