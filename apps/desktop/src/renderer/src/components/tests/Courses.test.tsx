import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, expect, it, vi } from 'vitest'
import { Courses } from '../Courses'

vi.mock('@renderer/hooks/useCourses', () => ({
    useCourses: () => ({
        courses: [
            { id: 'c1', name: 'Course 1' },
            { id: 'c2', name: 'Course 2' },
        ],
        selectedCourses: ['c1'],
        setSelectedCourses: vi.fn(),
    }),
}))

describe('Courses Component', () => {
    it('renders checkboxes for courses', () => {
        render(<Courses />)

        const course1Checkbox = screen.getByLabelText('Course 1')
        const course2Checkbox = screen.getByLabelText('Course 2')

        expect(course1Checkbox).toBeInTheDocument()
        expect(course2Checkbox).toBeInTheDocument()

        expect(course1Checkbox).toBeChecked()
        expect(course2Checkbox).not.toBeChecked()
    })

    it('updates selected courses on change', () => {
        render(<Courses />)

        const course1Checkbox = screen.getByLabelText('Course 1')
        const course2Checkbox = screen.getByLabelText('Course 2')

        fireEvent.click(course2Checkbox)

        expect(course1Checkbox).toBeChecked()
        expect(course2Checkbox).toBeChecked()

        fireEvent.click(course1Checkbox)

        expect(course1Checkbox).not.toBeChecked()
        expect(course2Checkbox).toBeChecked()
    })
})
