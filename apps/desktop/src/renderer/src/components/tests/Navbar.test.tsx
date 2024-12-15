import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, expect, it } from 'vitest'
import { Navbar } from '../Navbar'

describe('Navbar Component', () => {
    it('renders children correctly', () => {
        render(
            <Navbar>
                <div>Child 1</div>
                <div>Child 2</div>
            </Navbar>
        )

        const child1 = screen.getByText('Child 1')
        const child2 = screen.getByText('Child 2')

        expect(child1).toBeInTheDocument()
        expect(child2).toBeInTheDocument()
    })

    it('applies the correct styles', () => {
        render(
            <Navbar>
                <div>Child 1</div>
                <div>Child 2</div>
            </Navbar>
        )

        const flexElement = screen.getByText('Child 1').parentElement

        expect(flexElement).toHaveStyle({
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingInline: '1rem',
            paddingBlock: '0.5rem',
        })
    })
})
