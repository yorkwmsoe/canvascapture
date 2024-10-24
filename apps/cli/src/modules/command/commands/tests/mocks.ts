import { vi } from 'vitest'
export const checkbox = vi.fn()
export const getCourses = vi.fn()
export const getAssignments = vi.fn()
export const getSubmissions = vi.fn()

vi.mock('@inquirer/prompts', () => ({
    checkbox: checkbox,
}))

vi.mock('@canvas-capture/lib', () => ({
    createCanvasApi: vi.fn().mockImplementation(() => ({
        getCourses: getCourses,
        getAssignments: getAssignments,
        getSubmissions: getSubmissions,
    })),
}))
