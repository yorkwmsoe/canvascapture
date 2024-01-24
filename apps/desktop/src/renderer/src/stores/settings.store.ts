import { create } from 'zustand'

export type SettingsStore = {
  canvasDomain: string | undefined
  accessToken: string | undefined
  setCanvasDomain: (domain: string) => void
  setAccessToken: (token: string) => void
}

export const useSettingsStore = create<SettingsStore>()((set) => ({
  canvasDomain: undefined, // TODO: Load from local file //Hardcode for now
  accessToken: undefined, // TODO: Load from local file //Hardcode for now
  setCanvasDomain: (domain) => set({ canvasDomain: domain }),
  setAccessToken: (token) => set({ accessToken: token })
}))
