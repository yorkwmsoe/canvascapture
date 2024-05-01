import {
    DataNode,
    isCouseDataNode,
    isAssignmentDataNode,
    FileDataNode,
    isFileDataNode,
} from '@canvas-capture/lib'
import { useGenerateNext } from '@renderer/components/Generate/useGenerateNext'
import { MarkdownEditor } from '@renderer/components/MarkdownEditor'
import { Navbar } from '@renderer/components/Navbar'
import { STEPS } from '@renderer/components/SwitchStepper'
import { LeftArrowIcon } from '@renderer/components/icons/LeftArrow'
import { getCourseName } from '@renderer/utils/courses'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { App, Button, Flex, Spin, TreeDataNode, Typography } from 'antd'
import { useCallback, useMemo, useState } from 'react'

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
    const { notification } = App.useApp()
    const navigate = useNavigate({ from: '/markdown-editor' })
    const queryClient = useQueryClient()
    const { runPreGenerate, runGenerate } = useGenerateNext()
    const { isLoading, data } = useQuery({
        queryKey: ['pre-generate'],
        queryFn: runPreGenerate,
    })
    const { mutate: generate, isPending: isGenerating } = useMutation({
        mutationFn: runGenerate,
        onSuccess: () => {
            navigate({ to: '/' })
        },
        onError: () => {
            notification.error({
                message: 'Generation Failed',
                description: 'Please try again',
            })
        },
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

    const handleFinish = useCallback(() => {
        generate(data)
    }, [data, generate])

    const handleSaveFile = (key: string, content: string) => {
        const node = findDataNodeByKey(key, data ?? [])
        if (node && isFileDataNode(node)) {
            node.content = content.split('\n')
        }
    }

    return (
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
            <Navbar>
                <Button onClick={goBack} icon={<LeftArrowIcon />}>
                    Back
                </Button>
            </Navbar>
            <Typography.Title level={2} style={{ textAlign: 'center' }}>
                Markdown Editor
            </Typography.Title>
            <div style={{ marginInline: '1rem' }}>
                {!isLoading && !isGenerating ? (
                    <MarkdownEditor
                        treeData={treeData}
                        selectedFile={selectedFile}
                        handleSelectFile={selectFile}
                        handleSaveFile={handleSaveFile}
                        handleFinish={handleFinish}
                    />
                ) : (
                    <Flex justify="center" align="center">
                        <Spin tip={isGenerating ? 'Generating' : 'Loading'}>
                            <div
                                style={{
                                    padding: '50px',
                                    background: 'rgba(0, 0, 0, 0.05)',
                                    borderRadius: '4px',
                                }}
                            />
                        </Spin>
                    </Flex>
                )}
            </div>
        </div>
    )
}
