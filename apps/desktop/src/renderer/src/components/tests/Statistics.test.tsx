import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, expect, it } from 'vitest'
import {
    Statistics,
    oneYearExport,
    AverageAssignmentGradeExport,
} from '../Statistics'

describe('Statistics Component', () => {
    it('renders checkboxes with correct initial states', () => {
        render(<Statistics />)

        const oneYearCheckbox = screen.getByTitle(
            'Time to grade assignments, over one year'
        )
        const avgAssignCheckbox = screen.getByTitle(
            'Time to grade assignments, over multiple years'
        )

        expect(oneYearCheckbox).toBeInTheDocument()
        expect(avgAssignCheckbox).toBeInTheDocument()

        expect(oneYearCheckbox).not.toBeChecked()
        expect(avgAssignCheckbox).not.toBeChecked()
    })

    it('updates checkbox states on change', () => {
        render(<Statistics />)

        const oneYearCheckbox = screen.getByTitle(
            'Time to grade assignments, over one year'
        )
        const avgAssignCheckbox = screen.getByTitle(
            'Time to grade assignments, over multiple years'
        )

        fireEvent.click(oneYearCheckbox)
        expect(oneYearExport()).toBe(true)

        fireEvent.click(avgAssignCheckbox)
        expect(AverageAssignmentGradeExport()).toBe(true)

        fireEvent.click(oneYearCheckbox)
        expect(oneYearExport()).toBe(false)

        fireEvent.click(avgAssignCheckbox)
        expect(AverageAssignmentGradeExport()).toBe(false)
    })
})
