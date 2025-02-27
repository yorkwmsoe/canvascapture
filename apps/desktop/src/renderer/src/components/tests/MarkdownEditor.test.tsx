import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MarkdownEditor, MarkdownEditorProps } from '../MarkdownEditor'

vi.mock('antd', async () => {
    const originalModule = await vi.importActual('antd')
    return {
        ...originalModule,
        App: {
            useApp: () => ({
                modal: { confirm: vi.fn() },
                message: { success: vi.fn() },
            }),
        },
    }
})

const defaultProps: MarkdownEditorProps = {
    treeData: [
        {
            title: 'Course 1',
            key: '0-0',
            children: [
                {
                    title: 'Assignment 1',
                    key: '0-0-0',
                    children: [
                        {
                            title: 'File 1',
                            key: 'file1',
                            isLeaf: true,
                        },
                    ],
                },
            ],
        },
    ],
    selectedFile: {
        type: 'file',
        key: 'file1',
        name: 'high',
        content: ['Initial content'],
    },
    handleSelectFile: vi.fn(),
    handleSaveFile: vi.fn(),
}

describe('MarkdownEditor', () => {
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
    })

    it('renders without crashing', () => {
        render(<MarkdownEditor {...defaultProps} />)
        expect(screen.getByText('File 1')).toBeInTheDocument()
    })

    it('handles file selection change', () => {
        render(<MarkdownEditor {...defaultProps} />)
        fireEvent.click(screen.getByText('File 1'))
        expect(defaultProps.handleSelectFile).toHaveBeenCalledWith('file1')
    })

    it('saves changes to file', () => {
        render(<MarkdownEditor {...defaultProps} />)
        fireEvent.click(screen.getByText('Markdown Editor'))
        const textboxes = screen.getAllByRole('textbox')
        for (const textbox of textboxes) {
            if (textbox.ariaLabel != 'for screen reader') {
                fireEvent.change(textbox, {
                    target: { value: 'Updated content' },
                })
                fireEvent.click(screen.getByText('Save Changes'))
                expect(defaultProps.handleSaveFile).toHaveBeenCalledWith(
                    'file1',
                    'Updated content'
                )
            }
        }
    })

    it('reverts changes to original text', () => {
        render(<MarkdownEditor {...defaultProps} />)
        fireEvent.click(screen.getByText('Markdown Editor'))
        const textboxes = screen.getAllByRole('textbox')
        for (const textbox of textboxes) {
            if (textbox.ariaLabel != 'for screen reader') {
                fireEvent.change(textbox, {
                    target: { value: 'Updated content' },
                })
                fireEvent.click(screen.getByText('Revert Changes'))
                expect(textbox.innerHTML).toBe('Initial content')
            }
        }
    })

    it('displays markdown preview correctly', () => {
        render(<MarkdownEditor {...defaultProps} />)
        fireEvent.click(screen.getByText('View'))
        expect(screen.getByText(/Initial content/)).toBeInTheDocument()
    })
})
