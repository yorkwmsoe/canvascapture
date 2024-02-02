import { create } from 'zustand'

export type CheckStore = {
    courseCheck: boolean
    setCourseCheck: (courseCheck: boolean) => void
}

export const useCheckStore = create<CheckStore>()((set) => ({
    courseCheck: false,
    setCourseCheck: (courseCheck) => set({ courseCheck }),
}))
