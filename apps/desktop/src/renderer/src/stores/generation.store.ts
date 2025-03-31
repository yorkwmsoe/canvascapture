/**
 * Defines the generation store
 * Used to set and store data from generation
 *
 * See the individual definitions below for more details
 */
import { create } from 'zustand'

type State = {
    courses: number[]
    assignments: string[]
    generationName: string
    requestedCharts: Record<string, boolean>
}

type Actions = {
    setCourses: (courses: number[]) => void
    setAssignments: (assignments: string[]) => void
    setGenerationName: (generationName: string) => void
    reset: () => void
    setRequestedChart: (itemName: string, requested: boolean) => void
}

export type GenerationStore = State & Actions

const initialState: State = {
    courses: [],
    assignments: [],
    generationName: '',
    requestedCharts: {},
}

export const useGenerationStore = create<GenerationStore>()((set) => ({
    ...initialState,
    setCourses: (courses) => set({ courses }),
    setAssignments: (assignments) => set({ assignments }),
    setGenerationName: (generationName) => set({ generationName }),
    setRequestedChart: (itemName, requested) =>
        set((state) => ({
            requestedCharts: {
                ...state.requestedCharts,
                [itemName]: requested,
            },
        })),
    reset: () => set(initialState),
}))
