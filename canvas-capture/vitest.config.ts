import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        coverage: {
            provider: 'v8',
        },
        reporters: ['default', 'junit'],
        outputFile: 'junit.xml',
    },
})
