import { Input } from 'antd'
import { DirectoryTree } from '../DirectoryTree'
import { SideBar } from './Sidebar'
import { DirectoryTreeProps } from 'antd/es/tree'
import { Key, useState } from 'react'
import { popConfirm } from '@renderer/lib/model'

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

export function MarkdownEditor() {
    const [selectedFile, setSelectedFile] = useState<string>(
        treeData[0].children[0].key
    )

    const [isDirty, setIsDirty] = useState(false)

    const handleTextChange = () => {
        setIsDirty(true)
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
            <Input.TextArea
                onChange={handleTextChange}
                style={{ flex: 4, minHeight: '500px' }}
            />
            <SideBar onSave={handleSave} />
        </div>
    )
}
