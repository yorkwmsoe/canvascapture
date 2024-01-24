import { create } from 'zustand'

export type SettingsStore = {
  canvasDomain: string
  accessToken: string
  setCanvasDomain: (domain: string) => void
  setAccessToken: (token: string) => void
}

export const useSettingsStore = create<SettingsStore>()((set) => ({
  canvasDomain: '', // TODO: Load from local file
  accessToken: '', // TODO: Load from local file
  setCanvasDomain: (domain) => set({ canvasDomain: domain }),
  setAccessToken: (token) => set({ accessToken: token })
}))
