import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, expect, it, vi } from 'vitest'
import { Assignments } from '../Assignments'

vi.mock('@renderer/hooks/useAssignments', () => ({
    useAssignments: () => ({
        selectedAssignments: [],
        assignments: [
            {
                courseId: 1,
                assignments: [
                    { id: 200, name: 'Assignment 1' },
                    { id: 300, name: 'Assignment 2' },
                ],
            },
        ],
        setSelectedAssignments: vi.fn(),
        getSubmissionTypesForAssignment: vi.fn(() => ['online_text_entry']),
    }),
}))

vi.mock('@renderer/hooks/useCourses', () => ({
    useCourses: () => ({
        getCourseById: vi.fn(() => ({ id: 1, name: 'Course 1' })),
    }),
}))

describe('Assignments Component', () => {
    it('renders filter options', () => {
        render(<Assignments />)
        const filterInput = screen.getByTestId('filter-select')
        expect(filterInput).toBeInTheDocument()
    })

    it('renders tree with assignments', () => {
        render(<Assignments />)
        const courseNode = screen.getByText('Course 1')
        expect(courseNode).toBeInTheDocument()

        const switcher = screen.getByText('', {
            selector: '.ant-tree-switcher',
        })
        fireEvent.click(switcher)

        const assignment1Node = screen.getByText('Assignment 1')
        expect(assignment1Node).toBeInTheDocument()

        const assignment2Node = screen.getByText('Assignment 2')
        expect(assignment2Node).toBeInTheDocument()
    })

    it('checks assignments on selection', () => {
        render(<Assignments />)
        const switcher = screen.getByText('', {
            selector: '.ant-tree-switcher',
        })
        fireEvent.click(switcher)

        const checkboxes = screen.getAllByText('', {
            selector: '.ant-tree-checkbox-inner',
        })
        expect(checkboxes.length).toBeGreaterThan(0)
        fireEvent.click(checkboxes[1])
        expect(checkboxes[1]).toHaveBeenCalled
    })

    it('filters assignments based on selected submission types', () => {
        render(<Assignments />)
        const filterInput = screen.getByTestId('filter-select')
        if (filterInput.firstElementChild != null) {
            fireEvent.mouseDown(filterInput.firstElementChild)
            const selection = screen.getByText('Text Entry')
            fireEvent.click(selection)
            expect(filterInput.textContent).toBe('Text Entry ')

            const switcher = screen.getByText('', {
                selector: '.ant-tree-switcher',
            })
            fireEvent.click(switcher)

            const assignment1Node = screen.getByText('Assignment 1')
            expect(assignment1Node).toBeInTheDocument()

            const assignment2Node = screen.getByText('Assignment 2')
            expect(assignment2Node).toBeInTheDocument()
        }
    })
})
