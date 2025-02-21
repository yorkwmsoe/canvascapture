/**
 * Defines the MarkdownEditor react component
 *
 * See the definition below for more details
 */
import { Alert, App, Button, Input, Space, Tabs } from 'antd'
import { DirectoryTree } from '../DirectoryTree'
import { SideBar } from './Sidebar'
import { DirectoryTreeProps } from 'antd/es/tree'
import { ChangeEventHandler, Key, useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import { useTheme } from '@renderer/lib/useTheme'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import { ExternalLink } from '../ExternalLink'
import { FileDataNode } from '@canvas-capture/lib'
import { GUIEditor } from './GUIEditor'
import { RevertIcon } from '@renderer/components/icons/Revert'
import { FileOutlined } from '@ant-design/icons'

export type MarkdownEditorProps = {
    treeData: DirectoryTreeProps['treeData']
    selectedFile: FileDataNode | undefined
    handleSelectFile: (key: string) => void
    handleSaveFile: (key: string, content: string) => void
}

export function MarkdownEditor({
    treeData,
    selectedFile,
    handleSelectFile,
    handleSaveFile,
}: MarkdownEditorProps) {
    const { modal, message } = App.useApp()
    const { token } = useTheme()
    const [text, setText] = useState<string>()
    const [originalText, setOriginalText] = useState<string>()
    const [guiText, setGUIText] = useState<string>()

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

    const editorTabs = [
        {
            key: '1',
            label: 'Standard Editor',
            children: (
                <div style={{ flex: 4 }}>
                    <Alert
                        message="Leaving a Section title blank will omit that section from the generated report."
                        type="info"
                        showIcon
                    />
                    <br />
                    <GUIEditor
                        setGUIText={setGUIText}
                        setText={setText}
                        selectedFile={selectedFile}
                        guiText={guiText}
                        setIsDirty={setIsDirty}
                    />
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
                    <Button onClick={revertToOriginal} icon={<RevertIcon />}>
                        Revert changes
                    </Button>
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
            <div>
                <h2 style={{ marginBottom: 0 }}>Select a File Below to Edit</h2>
                <p style={{ marginTop: 0 }}>
                    Files are indicated by: <FileOutlined />
                </p>
                <DirectoryTree
                    style={{
                        flex: 1,
                        border: `1px dashed ${token.colorBorder}`,
                        borderRadius: token.borderRadiusLG,
                        marginBottom: '10px',
                        overflowY: 'scroll',
                        maxHeight: '65vh',
                        maxWidth: '400px',
                    }}
                    multiple
                    defaultExpandAll
                    treeData={treeData}
                    onSelect={handleChangeFile}
                    selectedKeys={selectedFile ? [selectedFile.key] : []}
                />
            </div>
            <div style={{ flex: 5 }}>
                <Tabs defaultActiveKey="1" items={tabs} type="card" />
            </div>
            <SideBar onSave={handleSave} />
        </div>
    )
}
