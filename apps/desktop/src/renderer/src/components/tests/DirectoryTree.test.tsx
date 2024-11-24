import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, expect, it } from 'vitest'
import { DirectoryTree } from '../DirectoryTree'

const treeData = [
    {
        title: 'Parent 1',
        key: '0-0',
        children: [
            { title: 'Child 1', key: '0-0-0' },
            { title: 'Child 2', key: '0-0-1' },
        ],
    },
    {
        title: 'Parent 2',
        key: '0-1',
        children: [
            { title: 'Child 3', key: '0-1-0' },
            { title: 'Child 4', key: '0-1-1' },
        ],
    },
]

describe('DirectoryTree Component', () => {
    it('renders the tree nodes', () => {
        render(<DirectoryTree treeData={treeData} />)

        const parentNode1 = screen.getByText('Parent 1')
        const parentNode2 = screen.getByText('Parent 2')

        expect(parentNode1).toBeInTheDocument()
        expect(parentNode2).toBeInTheDocument()

        expect(screen.queryByText('Child 1')).not.toBeInTheDocument()
        expect(screen.queryByText('Child 2')).not.toBeInTheDocument()
        expect(screen.queryByText('Child 3')).not.toBeInTheDocument()
        expect(screen.queryByText('Child 4')).not.toBeInTheDocument()
    })

    it('expands and collapses nodes on click', () => {
        render(<DirectoryTree treeData={treeData} />)

        const parentNode1Switcher = screen.getAllByRole('img', {
            name: 'caret-down',
        })[0]
        fireEvent.click(parentNode1Switcher)

        expect(screen.getByText('Child 1')).toBeInTheDocument()
        expect(screen.getByText('Child 2')).toBeInTheDocument()

        fireEvent.click(parentNode1Switcher)

        expect(screen.queryByText('Child 1')).not.toBeInTheDocument()
        expect(screen.queryByText('Child 2')).not.toBeInTheDocument()
    })
})
