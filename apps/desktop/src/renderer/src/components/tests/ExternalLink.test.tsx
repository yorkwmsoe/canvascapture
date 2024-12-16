import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, expect, it, vi } from 'vitest'
import { shell } from 'electron'
import { ExternalLink } from '../ExternalLink'

vi.mock('electron', () => ({
    shell: {
        openExternal: vi.fn(),
    },
}))

describe('ExternalLink Component', () => {
    it('renders children correctly', () => {
        render(
            <ExternalLink href="https://example.com">Example Link</ExternalLink>
        )

        const linkElement = screen.getByText('Example Link')
        expect(linkElement).toBeInTheDocument()
    })

    it('calls shell.openExternal with the correct URL on click', () => {
        render(
            <ExternalLink href="https://example.com">Example Link</ExternalLink>
        )

        const linkElement = screen.getByText('Example Link')

        fireEvent.click(linkElement)

        expect(shell.openExternal).toHaveBeenCalledWith('https://example.com')
    })
})
