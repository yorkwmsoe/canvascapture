/**
 * Defines the GUIEditor react component
 *
 * See the definition below for more details
 */
import { ReactNode, useState } from 'react'
import { Button, ConfigProvider, Form, Input } from 'antd'
import { FileDataNode } from '@canvas-capture/lib'
import { EditableTable } from './EditableTable'
import { AddIcon } from '@renderer/components/icons/Add'
import { RemoveIcon } from '@renderer/components/icons/Remove'

export type GUIEditorProps = {
    setGUIText: (text: string) => void
    setText: (text: string) => void
    selectedFile: FileDataNode | undefined
    guiText: string | undefined
    setIsDirty: (value: boolean) => void
}

export function GUIEditor({
    setGUIText,
    setText,
    selectedFile,
    guiText,
    setIsDirty,
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
        setIsDirty(true)
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

    const updateBodyText = (id: number, text: string) => {
        bodyText[id] = text
    }

    const updateForceInclude = (value: boolean) => {
        forceInclude = value
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
                sectionTitleDescription = 'Assignment title: '
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
                                <EditableTable
                                    tableText={sectionBody}
                                    id={sectionID}
                                    updateBodyText={updateBodyText}
                                    updateGUISectionText={updateGUISectionText}
                                    updateGUIText={updateGUIText}
                                    updateForceInclude={updateForceInclude}
                                />
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
                        icon={<AddIcon />}
                    >
                        Add New Section Below
                    </Button>
                    <Button
                        id={'deleteSectionButton' + sectionID}
                        onClick={deleteSection}
                        icon={<RemoveIcon />}
                    >
                        Delete Section
                    </Button>
                    <ConfigProvider wave={{ disabled: true }}>
                        <Button
                            id={'includeExcludeSectionButton' + sectionID}
                            onClick={includeExcludeSection}
                        >
                            Exclude Section
                        </Button>
                    </ConfigProvider>
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
