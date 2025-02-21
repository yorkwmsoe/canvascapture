/**
 * Defines the settings store
 * Used to set and store data from settings
 *
 * See the definition below for more details
 */
import { getConfig, setConfig } from '@renderer/utils/config'
import { create } from 'zustand'
import { CANVAS_DOMAIN } from '@renderer/utils/base-info'

export type SettingsStore = {
    canvasDomain: string
    canvasAccessToken: string
    markdownEditor: boolean
    isStudent: boolean
    setCanvasAccessToken: (token: string) => void
    setMarkdownEditor: (enabled: boolean) => void
    setIsStudent: (enabled: boolean) => void
}

export const useSettingsStore = create<SettingsStore>()((set) => ({
    canvasDomain: CANVAS_DOMAIN,
    canvasAccessToken: getConfig().canvasAccessToken,
    markdownEditor: getConfig().markdownEditor,
    isStudent: getConfig().isStudent,
    setCanvasAccessToken: (token) => {
        set((state) => {
            setConfig({ ...state, canvasAccessToken: token })
            return { canvasAccessToken: token }
        })
    },
    setMarkdownEditor: (enabled) => {
        set((state) => {
            setConfig({ ...state, markdownEditor: enabled })
            return { markdownEditor: enabled }
        })
    },
    setIsStudent: (enabled) => {
        set((state) => {
            setConfig({ ...state, isStudent: enabled })
            return { isStudent: enabled }
        })
    },
}))
