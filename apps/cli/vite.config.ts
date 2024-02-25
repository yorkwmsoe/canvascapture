import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'
import { node } from '@liuli-util/vite-plugin-node'

export default defineConfig({
    plugins: [node({ entry: 'src/cli.ts', outDir: 'build' }), tsconfigPaths()],
})
