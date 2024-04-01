import { Input, Tabs } from 'antd'
import { DirectoryTree } from '../DirectoryTree'
import { SideBar } from './Sidebar'
import { DirectoryTreeProps } from 'antd/es/tree'
import { ChangeEventHandler, Key, useState } from 'react'
import { popConfirm } from '@renderer/lib/model'
import Markdown from 'react-markdown'
import { useTheme } from '@renderer/lib/useTheme'
import remarkGfm from 'remark-gfm'
import { ExternalLink } from '../ExternalLink'

const treeData = [
    {
        title: 'parent 1-0',
        key: '0-0-0',
        selectable: false,
        children: [
            {
                title: 'leaf',
                key: '0-0-0-0',
                isLeaf: true,
            },
            {
                title: 'leaf',
                key: '0-0-0-1',
                isLeaf: true,
            },
        ],
    },
    {
        title: 'parent 1-1',
        key: '0-0-1',
        selectable: false,
        children: [
            {
                title: 'leaf',
                key: '0-0-1-0',
                isLeaf: true,
            },
        ],
    },
] satisfies DirectoryTreeProps['treeData']

export type MarkdownEditorProps = {
    defaultValue: string
    handleFinish: () => void
}

export function MarkdownEditor({
    defaultValue,
    handleFinish,
}: MarkdownEditorProps) {
    const { token } = useTheme()
    const [text, setText] = useState<string>(defaultValue)
    const [selectedFile, setSelectedFile] = useState<string>(
        treeData[0].children[0].key
    )

    const [isDirty, setIsDirty] = useState(false)

    const handleTextChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
        setIsDirty(true)
        setText(e.target.value)
    }

    const handleChangeFile = (files: Key[]) => {
        if (!isDirty) {
            setSelectedFile(files[0].toString())
        } else {
            popConfirm({
                title: 'Unsaved Changes',
                content:
                    'You have unsaved changes. Are you sure you want to continue?',

                onOk() {
                    setSelectedFile(files[0].toString())
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
                selectedKeys={[selectedFile]}
            />
            <div style={{ width: '600px' }}>
                <Tabs defaultActiveKey="1" items={tabs} type="card" />
            </div>
            <SideBar onSave={handleSave} onFinish={handleFinish} />
        </div>
    )
}
