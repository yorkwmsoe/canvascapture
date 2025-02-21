import { render, fireEvent, screen, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest'
import { SwitchStepper } from '../SwitchStepper'
import { useCourses } from '@renderer/hooks/useCourses'
import { useAssignments } from '@renderer/hooks/useAssignments'
import { useSettingsStore } from '@renderer/stores/settings.store'
import { useNavigate, useSearch } from '@tanstack/react-router'

vi.mock('../Statistics', () => ({
    Statistics: () => {},
}))

vi.mock('../Assignments', () => ({
    Assignments: () => {},
}))

vi.mock('../Courses', () => ({
    Courses: () => {},
}))

vi.mock('../Generate', () => ({
    Generate: () => {},
}))

vi.mock('@renderer/hooks/useCourses', () => ({
    useCourses: vi.fn(),
}))
vi.mock('@renderer/hooks/useAssignments', () => ({
    useAssignments: vi.fn(),
}))
vi.mock('@renderer/stores/settings.store', () => ({
    useSettingsStore: vi.fn(),
}))
vi.mock('@tanstack/react-router', () => ({
    useNavigate: vi.fn(),
    useSearch: vi.fn(),
}))

describe('SwitchStepper', () => {
    const mockNavigate = vi.fn()
    const mockUseSearch = vi.fn(() => ({ step: 0 }))
    const mockUseCourses = vi.fn(() => ({
        selectedCourses: [1],
        courses: undefined,
        getCourseById: vi.fn(),
        setSelectedCourses: vi.fn(),
    }))
    const mockUseAssignments = vi.fn(() => ({
        selectedAssignments: ['1'],
        assignments: [],
        setSelectedAssignments: vi.fn(),
        getAssignmentsByCourseId: vi.fn(),
        getAssignmentById: vi.fn(),
        getSubmissionTypesForAssignment: vi.fn(),
    }))
    const mockUseSettingsStore = vi.fn(() => ({ markdownEditor: false }))

    beforeAll(() => {
        window.matchMedia = () => ({
            matches: false,
            addEventListener: () => {},
            removeEventListener: () => {},
            media: '',
            onchange: vi.fn(),
            dispatchEvent(event: Event): boolean {
                return event.bubbles ? false : false
            },
            addListener: () => {},
            removeListener: () => {},
        })
    })

    beforeEach(() => {
        vi.clearAllMocks()
        mockNavigate.mockClear()
        vi.mocked(useNavigate).mockReturnValue(mockNavigate)
        vi.mocked(useSearch).mockImplementation(mockUseSearch)
        vi.mocked(useCourses).mockImplementation(mockUseCourses)
        vi.mocked(useAssignments).mockImplementation(mockUseAssignments)
        vi.mocked(useSettingsStore).mockImplementation(mockUseSettingsStore)
    })

    it('renders without crashing', () => {
        render(<SwitchStepper />)
        expect(screen.getByText('Courses')).toBeInTheDocument()
    })

    it('enables Next button if courses are selected', async () => {
        render(<SwitchStepper />)
        const nextButton = screen.getByText('Next')
        expect(nextButton).not.toBeDisabled()
    })

    it('navigates to next step on Next button click', async () => {
        render(<SwitchStepper />)
        const nextButton = screen.getByText('Next')

        await act(async () => {
            fireEvent.click(nextButton)
        })

        expect(screen.getByText('Assignments')).toBeInTheDocument()
    })

    it('navigates to previous step on Previous button click', async () => {
        render(<SwitchStepper />)
        const nextButton = screen.getByText('Next')

        await act(async () => {
            fireEvent.click(nextButton)
        })

        const prevButton = screen.getByText('Previous')

        await act(async () => {
            fireEvent.click(prevButton)
        })

        expect(screen.getByText('Courses')).toBeInTheDocument()
    })

    it('navigates to markdown editor if markdownEditor is true', async () => {
        mockUseSettingsStore.mockImplementation(() => ({
            markdownEditor: true,
        }))
        mockUseSearch.mockImplementation(() => ({ step: 2 }))
        render(<SwitchStepper />)

        const nextButton = screen.getByText('Next')

        await act(async () => {
            fireEvent.click(nextButton)
        })

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith({
                to: '/markdown-editor',
            })
        })
    })
})
