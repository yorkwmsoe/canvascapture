import { create } from 'zustand'

export type SettingsStore = {
  canvasDomain: string
  accessToken: string
  setCanvasDomain: (domain: string) => void
  setAccessToken: (token: string) => void
}

export const useSettingsStore = create<SettingsStore>()((set) => ({
  canvasDomain: 'http://sdlstudentvm06.msoe.edu/api/v1', // TODO: Load from local file
  accessToken: 'reK0qt1RHGt1tCVrNwrNasbWnOd8T52y2vW4BV3yM1mXZ9jtLAXU6Xn2mtzcNZ3B', // TODO: Load from local file
  setCanvasDomain: (domain) => set({ canvasDomain: domain }),
  setAccessToken: (token) => set({ accessToken: token })
}))
