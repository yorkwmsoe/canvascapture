import { getConfig, setConfig } from '@renderer/lib/config'
import { create } from 'zustand'

export type SettingsStore = {
  canvasDomain: string
  canvasAccessToken: string
  markdownEditor: boolean
  setCanvasDomain: (domain: string) => void
  setCanvasAccessToken: (token: string) => void
  setMarkdownEditor: (enabled: boolean) => void
}

export const useSettingsStore = create<SettingsStore>()((set) => ({
  canvasDomain: getConfig().canvasDomain,
  canvasAccessToken: getConfig().canvasAccessToken,
  markdownEditor: getConfig().markdownEditor,
  setCanvasDomain: (domain) => {
    set((state) => {
      setConfig({ ...state, canvasDomain: domain })
      return { canvasDomain: domain }
    })
  },
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
  }
}))
