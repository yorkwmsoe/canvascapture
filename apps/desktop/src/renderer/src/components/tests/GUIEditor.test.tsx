import { act, render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GUIEditor, GUIEditorProps } from '../MarkdownEditor/GUIEditor'

const defaultProps: GUIEditorProps = {
    setGUIText: vi.fn((text) => (defaultProps.guiText = text)),
    setText: vi.fn(),
    selectedFile: {
        type: 'file',
        key: 'file1',
        name: 'high',
        content: ['# Section 1\nContent 1\n## Section 2\nContent 2'],
    },
    guiText: '# Section 1\nContent 1\n## Section 2\nContent 2',
}

describe('GUIEditor', () => {
    beforeEach(() => {
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
        defaultProps.guiText = '# Section 1\nContent 1\n## Section 2\nContent 2'
    })

    it('renders without crashing', () => {
        render(<GUIEditor {...defaultProps} />)
        const titleInputs = screen.getAllByPlaceholderText(
            'Section will be omitted'
        )
        for (const titleInput of titleInputs) {
            expect(titleInput).toBeInTheDocument()
        }
    })

    it('updates section title', async () => {
        render(<GUIEditor {...defaultProps} />)
        const titleInputs = screen.getAllByPlaceholderText(
            'Section will be omitted'
        )
        await act(async () => {
            fireEvent.change(titleInputs[0], {
                target: { value: 'New Section Title' },
            })
        })
        expect(defaultProps.setGUIText).toHaveBeenCalled()
        expect(defaultProps.setText).toHaveBeenCalled()
        expect(defaultProps.guiText).toBe(
            '# New Section Title\nContent 1\n## Section 2\nContent 2'
        )
    })

    it('updates section body', async () => {
        render(<GUIEditor {...defaultProps} />)
        const textareas = screen.getAllByRole('textbox')
        await act(async () => {
            fireEvent.change(textareas[1], {
                target: { value: 'New Section Body\n' },
            })
        })
        expect(defaultProps.setGUIText).toHaveBeenCalled()
        expect(defaultProps.setText).toHaveBeenCalled()
        expect(defaultProps.guiText).toBe(
            '# Section 1\nNew Section Body\n## Section 2\nContent 2'
        )
    })

    it('adds a new section', async () => {
        render(<GUIEditor {...defaultProps} />)
        const newSectionButtons = screen.getAllByText('Add New Section Below')
        await act(async () => {
            fireEvent.click(newSectionButtons[0])
        })
        expect(defaultProps.setGUIText).toHaveBeenCalled()
        expect(defaultProps.setText).toHaveBeenCalled()
        expect(defaultProps.guiText).toBe(
            '# Section 1\nContent 1\n## \n\n## Section 2\nContent 2'
        )
    })

    it('deletes a section', async () => {
        render(<GUIEditor {...defaultProps} />)
        const deleteButtons = screen.getAllByText('Delete Section')
        await act(async () => {
            fireEvent.click(deleteButtons[1])
        })
        expect(defaultProps.setGUIText).toHaveBeenCalled()
        expect(defaultProps.setText).toHaveBeenCalled()
        expect(defaultProps.guiText).toBe('# Section 1\nContent 1\n')
    })

    it('includes/excludes a section', async () => {
        render(<GUIEditor {...defaultProps} />)
        const excludeButtons = screen.getAllByText('Exclude Section')
        await act(async () => {
            fireEvent.click(excludeButtons[0])
        })
        expect(defaultProps.setText).toHaveBeenCalled()
    })
})
