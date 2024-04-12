import {
    DataNode,
    FileDataNode,
    isAssignmentDataNode,
    isCouseDataNode,
    isFileDataNode,
    useGenerateNext,
} from '@renderer/components/Generate/useGenerateNext'
import { MarkdownEditor } from '@renderer/components/MarkdownEditor'
import { Navbar } from '@renderer/components/Navbar'
import { STEPS } from '@renderer/components/SwitchStepper'
import { LeftArrowIcon } from '@renderer/components/icons/LeftArrow'
import { getCourseName } from '@renderer/utils/courses'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Button, Flex, Spin, TreeDataNode, Typography } from 'antd'
import { useMemo, useState } from 'react'

function transformData(data: DataNode): TreeDataNode {
    if (isCouseDataNode(data)) {
        return {
            title: getCourseName(data.course),
            key: data.key,
            children: data.children.map(transformData),
        }
    }
    if (isAssignmentDataNode(data)) {
        return {
            title: data.assignment.name,
            key: data.key,
            children: data.children.map(transformData),
        }
    }
    return {
        title: data.name,
        key: data.key,
        isLeaf: true,
    }
}

function findDataNodeByKey(
    key: string,
    data: DataNode[]
): DataNode | undefined {
    for (const node of data) {
        if (node.key === key) {
            return node
        }
        if (isCouseDataNode(node) || isAssignmentDataNode(node)) {
            const found = findDataNodeByKey(key, node.children)
            if (found) {
                return found
            }
        }
    }
    return
}

export function MarkdownEditorPage() {
    const navigate = useNavigate({ from: '/markdown-editor' })
    const queryClient = useQueryClient()
    const { runPreGenerate } = useGenerateNext()
    const { isLoading, data } = useQuery({
        queryKey: ['pre-generate'],
        queryFn: runPreGenerate,
    })

    const treeData = useMemo(() => {
        return data?.map(transformData)
    }, [data])

    const [selectedFile, setSelectedFile] = useState<FileDataNode>()

    const selectFile = (key: string) => {
        const node = findDataNodeByKey(key, data ?? [])
        if (node && isFileDataNode(node)) {
            setSelectedFile(node)
        }
    }

    const goBack = () => {
        queryClient.removeQueries({
            queryKey: ['pre-generate'],
        })
        navigate({ to: '/selection', search: { step: STEPS.length - 2 } })
    }

    const handleFinish = () => {
        navigate({ to: '/selection', search: { step: STEPS.length - 1 } })
    }

    return (
        <>
            <Navbar>
                <Button onClick={goBack} icon={<LeftArrowIcon />}>
                    Back
                </Button>
            </Navbar>
            <Typography.Title level={2} style={{ textAlign: 'center' }}>
                Markdown Editor
            </Typography.Title>
            <div style={{ marginInline: '1rem' }}>
                {!isLoading ? (
                    <MarkdownEditor
                        treeData={treeData}
                        selectedFile={selectedFile}
                        handleSelectFile={selectFile}
                        handleFinish={handleFinish}
                    />
                ) : (
                    <Flex justify="center" align="center">
                        <Spin />
                    </Flex>
                )}
            </div>
        </>
    )
}
