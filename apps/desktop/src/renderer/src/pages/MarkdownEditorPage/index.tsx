/**
 * Defines the MarkdownEditorPage and related helper function
 *
 * See the individual definitions below for more details
 */
import {
    DataNode,
    isCourseDataNode,
    isAssignmentDataNode,
    FileDataNode,
    isFileDataNode,
} from '@canvas-capture/lib'
import { useGenerateNext } from '@renderer/components/Generate/useGenerateNext'
import { MarkdownEditor } from '@renderer/components/MarkdownEditor'
import { STEPS } from '@renderer/components/SwitchStepper'
import { LeftArrowIcon } from '@renderer/components/icons/LeftArrow'
import { getCourseName } from '@renderer/utils/courses'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import {
    App,
    Button,
    Flex,
    Popconfirm,
    Spin,
    TreeDataNode,
    Typography,
} from 'antd'
import { useCallback, useMemo, useState } from 'react'
import { ErrorBoundary } from '@renderer/components/ErrorBoundary'
import { CheckIcon } from '@renderer/components/icons/Check'

function transformData(data: DataNode): TreeDataNode {
    if (isCourseDataNode(data)) {
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
        if (isCourseDataNode(node) || isAssignmentDataNode(node)) {
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
            notification.destroy()
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
        generate(data) // TODO: implement this similarly for default.
    }, [data, generate])

    const handleSaveFile = (key: string, content: string) => {
        const node = findDataNodeByKey(key, data ?? [])
        if (node && isFileDataNode(node)) {
            node.content = content.split('\n')
        }
    }

    return (
        <ErrorBoundary>
            <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
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
                <div
                    style={{
                        bottom: 20,
                        position: 'fixed',
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: 24,
                        width: '100%',
                    }}
                >
                    <Button
                        onClick={goBack}
                        icon={<LeftArrowIcon />}
                        style={{ left: 20 }}
                    >
                        Previous
                    </Button>
                    <Popconfirm
                        title="Finish editing"
                        description="Are you sure your done editing? Make sure to save your changes."
                        okText="Yes"
                        cancelText="No"
                        onConfirm={handleFinish}
                    >
                        <Button
                            type="primary"
                            block
                            icon={<CheckIcon />}
                            style={{ right: 20, width: 'fit-content' }}
                        >
                            Generate
                        </Button>
                    </Popconfirm>
                </div>
            </div>
        </ErrorBoundary>
    )
}
