import { create } from 'zustand'

export type GenerationStore = {
    courses: string[],
    assignments: string[],
    setCourses: (courses: string[]) => void
    setAssignments: (assignments: string[]) => void
}

export const useGenerationStore = create<GenerationStore>()((set) => ({
    courses: [],
    assignments: [],
    setCourses: (courses ) => set({ courses }),
    setAssignments: (assignments) => set({ assignments })
}))
