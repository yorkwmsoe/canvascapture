/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly RENDERER_VITE_MODE: 'demo' | undefined
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

declare const __APP_VERSION__: string
