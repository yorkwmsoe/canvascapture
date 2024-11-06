import { Alert, App, Button, Form, Input, Space, Tabs } from 'antd'
import { DirectoryTree } from '../DirectoryTree'
import { SideBar } from './Sidebar'
import { DirectoryTreeProps } from 'antd/es/tree'
import { ChangeEventHandler, Key, ReactNode, useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import { useTheme } from '@renderer/lib/useTheme'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import { ExternalLink } from '../ExternalLink'
import { markdown, FileDataNode } from '@canvas-capture/lib'

export type MarkdownEditorProps = {
    treeData: DirectoryTreeProps['treeData']
    selectedFile: FileDataNode | undefined
    handleSelectFile: (key: string) => void
    handleSaveFile: (key: string, content: string) => void
    handleFinish: () => void
}

export function MarkdownEditor({
    treeData,
    selectedFile,
    handleSelectFile,
    handleSaveFile,
    handleFinish,
}: MarkdownEditorProps) {
    const { modal, message } = App.useApp()
    const { token } = useTheme()
    const [text, setText] = useState<string>()
    const [originalText, setOriginalText] = useState<string>()
    const [guiText, setGUIText] = useState<string>()
    const guiGeneratedText: string[] = []
    const titleText: string[] = []
    const bodyText: string[] = []

    useEffect(() => {
        setText(selectedFile?.content?.join('\n') ?? '')
        setOriginalText(selectedFile?.content?.join('\n') ?? '')
        setGUIText(selectedFile?.content?.join('\n') ?? '')
    }, [selectedFile])

    const [isDirty, setIsDirty] = useState(false)

    const handleTextChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
        setIsDirty(true)
        setText(e.target.value)
    }

    const handleChangeFile = (files: Key[]) => {
        if (!isDirty) {
            handleSelectFile(files[0].toString())
        } else {
            modal.confirm({
                title: 'Unsaved Changes',
                content:
                    'You have unsaved changes. Are you sure you want to continue?',

                onOk() {
                    handleSelectFile(files[0].toString())
                    setIsDirty(false)
                },
            })
        }
    }

    const handleSave = () => {
        if (selectedFile && text) {
            handleSaveFile(selectedFile.key, text)
            message.success('Saved!')
        }
        setIsDirty(false)
    }

    const revertToOriginal = () => {
        setText(originalText)
        setGUIText(originalText)
    }

    const updateGUIText = () => {
        let combinedGUIText: string = ''
        let combinedText: string = ''
        for (const section of guiGeneratedText) {
            combinedGUIText += section
            if (!section.startsWith('# \n') && !section.startsWith('## \n')) {
                combinedText += section
            }
        }
        setGUIText(combinedGUIText)
        setText(combinedText)
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
        updateGUISectionText(id)
        updateGUIText()
    }

    const handleSectionBodyChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        const id = parseInt(e.target.id.substring(14))
        bodyText[id] = e.target.value
        updateGUISectionText(id)
        updateGUIText()
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
        updateGUISectionText(e.target.className.substring(15))
        updateGUIText()
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
                    <hr />
                </div>
            )

            updateGUISectionText(sectionID)

            sectionID++
        }
        return guiChildren
    }

    const editorTabs = [
        {
            key: '1',
            label: 'Standard editor',
            children: (
                <div style={{ flex: 4 }}>
                    <Alert
                        message="Leaving a Section title blank will omit that section from the generated report."
                        type="info"
                        showIcon
                    />
                    <br />
                    {generateGUIEditor()}
                </div>
            ),
        },
        {
            key: '2',
            label: 'Markdown Editor',
            children: (
                <div>
                    <Alert
                        message="Changes made in the Markdown Editor will be overwritten by any subsequent changes made in the Standard Editor."
                        type="warning"
                        showIcon
                    />
                    <br />
                    <Input.TextArea
                        autoSize={{ maxRows: 15 }}
                        onChange={handleTextChange}
                        value={text}
                        style={{ flex: 4 }}
                    />
                </div>
            ),
        },
    ]

    const tabs = [
        {
            key: '1',
            label: 'Edit',
            children: (
                <div>
                    <Tabs defaultActiveKey="1" items={editorTabs} type="card" />
                    <Button onClick={revertToOriginal}>Revert changes</Button>
                </div>
            ),
        },
        {
            key: '2',
            label: 'View',
            children: (
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Alert
                        message="Markdown style might not reflect what you see in the pdf."
                        type="warning"
                        showIcon
                    />
                    <div
                        style={{
                            borderColor: token.colorBorder,
                            borderRadius: token.borderRadius,
                            borderWidth: token.lineWidth,
                            borderStyle: 'solid',
                            paddingInline: '0.5rem',
                            overflow: 'auto',
                            minHeight: '2rem',
                        }}
                    >
                        <Markdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                            components={{
                                a: ({ href, children }) => (
                                    <ExternalLink href={href}>
                                        {children}
                                    </ExternalLink>
                                ),
                            }}
                        >
                            {text}
                        </Markdown>
                    </div>
                </Space>
            ),
        },
    ]

    return (
        <div
            style={{
                display: 'flex',
                gap: '2rem',
            }}
        >
            <DirectoryTree
                style={{ flex: 1 }}
                multiple
                defaultExpandAll
                treeData={treeData}
                onSelect={handleChangeFile}
                selectedKeys={selectedFile ? [selectedFile.key] : []}
            />
            <div style={{ flex: 5 }}>
                <Tabs defaultActiveKey="1" items={tabs} type="card" />
            </div>
            <SideBar onSave={handleSave} onFinish={handleFinish} />
        </div>
    )
}
