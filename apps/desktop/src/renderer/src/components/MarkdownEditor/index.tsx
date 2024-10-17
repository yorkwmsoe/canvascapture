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
import { FileDataNode } from '@canvas-capture/lib'

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
            for (let i = 0; i < 5; i++) {
                updateGUISectionText(i)
            }
            updateGUIText()
        }
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
                            <Input.TextArea
                                value={sectionBody}
                                onChange={handleSectionBodyChange}
                                id={'guiSectionBody' + sectionID}
                                onClick={updateAllGUISectionText}
                                autoSize={{ maxRows: 15 }}
                            />
                        </Form.Item>
                    </Form>
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
