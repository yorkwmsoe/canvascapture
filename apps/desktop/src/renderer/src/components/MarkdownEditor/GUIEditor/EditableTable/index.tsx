import { markdown } from '@canvas-capture/lib'
import { ReactNode } from 'react'

export type EditableTableProps = {
    tableText: string
    id: number
    updateBodyText: (sectionId: number, text: string) => void
    updateGUISectionText: (id: number) => void
    updateGUIText: () => void
    updateForceInclude: (value: boolean) => void
}

export function EditableTable({
    tableText,
    id,
    updateBodyText,
    updateGUISectionText,
    updateGUIText,
    updateForceInclude,
}: EditableTableProps) {
    const handleTableCellChange = (e: React.BaseSyntheticEvent) => {
        const id = e.target.className.substring(15)
        const tableText = e.target.innerText
        const rowText = tableText.split('\n')
        const tableHeader: string = markdown.createTableHeader(
            rowText[0].split('\t')
        )
        const tableRows: string[][] = []
        for (let i = 1; i < rowText.length; i++) {
            const row = rowText[i]
            if (row != '' && row != '\t') {
                const rowCells: string[] = []
                const cellText = row.split('\t')
                for (const cell of cellText) {
                    rowCells.push(cell)
                }
                tableRows.push(rowCells)
            }
        }
        const tableBody: string = markdown.createTableRows(tableRows)
        updateBodyText(id, tableHeader + tableBody + '\n')
    }

    const handleTableUpdate = (e: React.BaseSyntheticEvent) => {
        const id = e.target.className.substring(15)
        updateGUISectionText(id)
        updateGUIText()
        updateForceInclude(true)
        document.getElementById('includeExcludeSectionButton' + id)?.click()
    }

    const generateTable = (tableText: string, id: number) => {
        tableText = tableText.trim()
        const rowText = tableText.split('\n')
        const tableChildren: ReactNode[] = []
        for (let i = 0; i < rowText.length; i++) {
            let row = rowText[i]
            if (!row.includes('---')) {
                row = row.substring(1, row.length - 1)
                const cells = row.split('|')
                const rowChildren: ReactNode[] = []
                for (let j = 0; j < cells.length; j++) {
                    const cellText = cells[j].trim()
                    rowChildren.push(
                        i == 0 ? (
                            <th
                                style={{ border: '1px solid black' }}
                                className={'tableForSection' + id}
                            >
                                {cellText}
                            </th>
                        ) : (
                            <td
                                style={{ border: '1px solid black' }}
                                className={'tableForSection' + id}
                            >
                                {cellText}
                            </td>
                        )
                    )
                }
                tableChildren.push(<tr>{rowChildren}</tr>)
            }
        }
        return (
            <table
                style={{ border: '1px solid black' }}
                contentEditable={true}
                onInput={handleTableCellChange}
                onMouseLeave={handleTableUpdate}
                className={'tableForSection' + id}
            >
                {tableChildren}
            </table>
        )
    }

    return generateTable(tableText, id)
}
