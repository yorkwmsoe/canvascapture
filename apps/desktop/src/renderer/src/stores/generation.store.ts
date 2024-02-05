import { create } from 'zustand'

type State = {
  courses: number[]
  assignments: string[]
}

type Actions = {
  setCourses: (courses: number[]) => void
  setAssignments: (assignments: string[]) => void
  reset: () => void
}

export type GenerationStore = State & Actions

const initialState: State = {
  courses: [],
  assignments: []
}

export const useGenerationStore = create<GenerationStore>()((set) => ({
  ...initialState,
  setCourses: (courses) => set({ courses }),
  setAssignments: (assignments) => set({ assignments }),
  reset: () => set(initialState)
}))
