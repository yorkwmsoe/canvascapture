import { App, Input, Tabs } from 'antd'
import { DirectoryTree } from '../DirectoryTree'
import { SideBar } from './Sidebar'
import { DirectoryTreeProps } from 'antd/es/tree'
import { ChangeEventHandler, Key, useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import { useTheme } from '@renderer/lib/useTheme'
import remarkGfm from 'remark-gfm'
import { ExternalLink } from '../ExternalLink'
import { FileDataNode } from '../Generate/useGenerateNext'

export type MarkdownEditorProps = {
    treeData: DirectoryTreeProps['treeData']
    selectedFile: FileDataNode | undefined
    handleSelectFile: (key: string) => void
    handleFinish: () => void
}

export function MarkdownEditor({
    treeData,
    selectedFile,
    handleSelectFile,
    handleFinish,
}: MarkdownEditorProps) {
    const { modal } = App.useApp()
    const { token } = useTheme()
    const [text, setText] = useState<string>()

    useEffect(() => {
        setText(selectedFile?.content?.join('\n') ?? '')
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
        setIsDirty(false)
    }

    const tabs = [
        {
            key: '1',
            label: 'Edit',
            children: (
                <Input.TextArea
                    autoSize={{ maxRows: 15 }}
                    onChange={handleTextChange}
                    value={text}
                    style={{ flex: 4 }}
                />
            ),
        },
        {
            key: '2',
            label: 'View',
            children: (
                <div
                    style={{
                        borderColor: token.colorBorder,
                        borderRadius: token.borderRadius,
                        borderWidth: token.lineWidth,
                        borderStyle: 'solid',
                        paddingInline: '0.5rem',
                        overflow: 'auto',
                    }}
                >
                    <Markdown
                        remarkPlugins={[remarkGfm]}
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
