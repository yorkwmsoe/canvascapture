import { ReactNode, useState } from 'react'
import { Button, Form, Input } from 'antd'
import { FileDataNode, markdown } from '@canvas-capture/lib'

export type GUIEditorProps = {
    setGUIText: (text: string) => void
    setText: (text: string) => void
    selectedFile: FileDataNode | undefined
    guiText: string | undefined
}

export function GUIEditor({
    setGUIText,
    setText,
    selectedFile,
    guiText,
}: GUIEditorProps) {
    const guiGeneratedText: string[] = []
    const titleText: string[] = []
    const bodyText: string[] = []
    const [excludedSections, setExcludedSections] = useState<boolean[]>([])
    let forceInclude: boolean = false

    const handleUpdateGUIText = (changedSection: number, changed: boolean) => {
        let combinedGUIText: string = ''
        let combinedText: string = ''
        for (let i = 0; i < guiGeneratedText.length; i++) {
            const section = guiGeneratedText[i]
            combinedGUIText += section
            if (
                (changedSection == i && changed
                    ? excludedSections[i]
                    : !excludedSections[i]) &&
                !section.startsWith('# \n') &&
                !section.startsWith('## \n')
            ) {
                combinedText += section
            }
        }
        setGUIText(combinedGUIText)
        setText(combinedText)
    }

    const updateGUIText = () => {
        handleUpdateGUIText(-1, false)
    }

    const updateGUISectionText = (id: number) => {
        guiGeneratedText[id] =
            (id == 0 ? '# ' : '## ') + titleText[id] + '\n' + bodyText[id]
    }

    const handleSectionTitleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const id = parseInt(e.target.id.substring(15))
        titleText[id] = e.target.value
        forceInclude = true
        updateGUISectionText(id)
        document.getElementById('includeExcludeSectionButton' + id)?.click()
    }

    const handleSectionBodyChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        const id = parseInt(e.target.id.substring(14))
        bodyText[id] = e.target.value
        forceInclude = true
        updateGUISectionText(id)
        document.getElementById('includeExcludeSectionButton' + id)?.click()
    }

    const updateAllGUISectionText = () => {
        if (selectedFile != undefined) {
            for (let i = 0; i < guiGeneratedText.length; i++) {
                updateGUISectionText(i)
            }
            updateGUIText()
        }
    }

    const addNewSection = (e: React.MouseEvent<HTMLElement>) => {
        if (selectedFile != undefined) {
            const id = parseInt(e.currentTarget.id.substring(16))
            const temporaryTitleText: string[] = []
            const temporaryBodyText: string[] = []
            for (let i = id + 1; i < guiGeneratedText.length; i++) {
                temporaryTitleText[i - (id + 1)] = titleText[i]
                temporaryBodyText[i - (id + 1)] = bodyText[i]
            }
            if (!bodyText[id].endsWith('\n')) {
                bodyText[id] = bodyText[id] + '\n'
            }
            updateGUISectionText(id)
            titleText[id + 1] = ''
            bodyText[id + 1] = '\n'
            updateGUISectionText(id + 1)
            for (let i = 0; i < temporaryTitleText.length; i++) {
                titleText[id + 2 + i] = temporaryTitleText[i]
                bodyText[id + 2 + i] = temporaryBodyText[i]
                updateGUISectionText(id + 2 + i)
            }
            updateGUIText()
        }
    }

    const deleteSection = (e: React.MouseEvent<HTMLElement>) => {
        if (selectedFile != undefined) {
            const id = parseInt(e.currentTarget.id.substring(19))
            titleText[id] = ''
            bodyText[id] = ''
            guiGeneratedText[id] = ''
            updateGUIText()
        }
    }

    const includeExcludeSection = (e: React.BaseSyntheticEvent) => {
        if (selectedFile != undefined) {
            const id = parseInt(e.currentTarget.id.substring(27))
            let changed = false
            if (guiGeneratedText.length != excludedSections.length) {
                const temporaryExcludedSections: boolean[] = []
                for (let i = 0; i < guiGeneratedText.length; i++) {
                    if (i == id) {
                        if (forceInclude) {
                            e.target.innerText = 'Exclude Section'
                            forceInclude = false
                            temporaryExcludedSections[i] = false
                        } else {
                            temporaryExcludedSections[i] = true
                            changed = true
                            e.target.innerText = 'Include Section'
                        }
                    } else {
                        temporaryExcludedSections[i] = false
                    }
                }
                setExcludedSections(temporaryExcludedSections)
            } else {
                setExcludedSections(
                    excludedSections.map((entry, index) => {
                        if (index == id) {
                            if (forceInclude) {
                                e.target.innerText = 'Exclude Section'
                                if (entry) {
                                    changed = true
                                }
                                forceInclude = false
                                return false
                            } else {
                                e.target.innerText = !entry
                                    ? 'Include Section'
                                    : 'Exclude Section'
                                changed = true
                                return !entry
                            }
                        } else {
                            return entry
                        }
                    })
                )
            }
            handleUpdateGUIText(id, changed)
        }
    }

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
        bodyText[id] = tableHeader + tableBody + '\n'
    }

    const handleTableUpdate = (e: React.BaseSyntheticEvent) => {
        const id = e.target.className.substring(15)
        updateGUISectionText(id)
        updateGUIText()
        forceInclude = true
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

    const generateGUIEditor = () => {
        const sections = guiText != undefined ? guiText.split('## ') : []
        const guiChildren: ReactNode[] = []
        let sectionID = 0
        for (const section of sections) {
            const sectionText = section.split('\n')
            let sectionTitle = sectionText[0]
            let sectionBody = ''
            for (let i = 1; i < sectionText.length; i++) {
                sectionBody += sectionText[i]
                if (i != sectionText.length - 1) {
                    sectionBody += '\n'
                }
            }
            let sectionTitleDescription = 'Section title: '
            if (sectionTitle.startsWith('# ')) {
                sectionTitle = sectionTitle.substring(2)
                sectionTitleDescription = 'PDF title: '
            }

            titleText[sectionID] = sectionTitle
            bodyText[sectionID] = sectionBody

            guiChildren.push(
                <div>
                    <Form>
                        <Form.Item label={sectionTitleDescription}>
                            <Input
                                value={sectionTitle}
                                onChange={handleSectionTitleChange}
                                id={'guiSectionTitle' + sectionID}
                                onClick={updateAllGUISectionText}
                                placeholder="Section will be omitted"
                            />
                        </Form.Item>
                        <Form.Item label="Section body">
                            {sectionBody.includes('| --- |') ? (
                                generateTable(sectionBody, sectionID)
                            ) : (
                                <Input.TextArea
                                    value={sectionBody}
                                    onChange={handleSectionBodyChange}
                                    id={'guiSectionBody' + sectionID}
                                    onClick={updateAllGUISectionText}
                                    autoSize={{ maxRows: 15 }}
                                />
                            )}
                        </Form.Item>
                    </Form>
                    <Button
                        id={'newSectionButton' + sectionID}
                        onClick={addNewSection}
                    >
                        Add New Section Below
                    </Button>
                    <Button
                        id={'deleteSectionButton' + sectionID}
                        onClick={deleteSection}
                    >
                        Delete Section
                    </Button>
                    <Button
                        id={'includeExcludeSectionButton' + sectionID}
                        onClick={includeExcludeSection}
                    >
                        Exclude Section
                    </Button>
                    <hr />
                </div>
            )

            updateGUISectionText(sectionID)

            sectionID++
        }
        return guiChildren
    }
    return generateGUIEditor()
}
