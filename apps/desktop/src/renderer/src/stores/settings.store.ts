import { getConfig, setConfig } from '@renderer/lib/config'
import { create } from 'zustand'

export type SettingsStore = {
  canvasDomain: string
  canvasAccessToken: string
  setCanvasDomain: (domain: string) => void
  setCanvasAccessToken: (token: string) => void
}

export const useSettingsStore = create<SettingsStore>()((set) => ({
  canvasDomain: getConfig().canvasDomain,
  canvasAccessToken: getConfig().canvasAccessToken,
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
  }
}))
