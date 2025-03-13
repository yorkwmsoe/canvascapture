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
import { Navbar } from '@renderer/components/Navbar'
import { HelpIcon } from '@renderer/components/icons/Help'

function transformData(data: DataNode): TreeDataNode {
    if (
        (isCourseDataNode(data) || isAssignmentDataNode(data)) &&
        data.children.length == 0
    ) {
        return {
            key: 'SKIP',
        }
    }
    if (isCourseDataNode(data)) {
        return {
            title: getCourseName(data.course),
            key: data.key,
            children: data.children
                .map(transformData)
                .filter((d) => d.key !== 'SKIP'),
        }
    }
    if (isAssignmentDataNode(data)) {
        return {
            title: data.assignment.name,
            key: data.key,
            children: data.children
                .map(transformData)
                .filter((d) => d.key !== 'SKIP'),
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
            notification.destroy()
            notification.success({
                message: 'Success',
                description: 'Report Successfully Generated!',
            })
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
        return data?.map(transformData).filter((d) => d.key !== 'SKIP')
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

    const goToHelpPage = () => {
        navigate({
            to: '/help',
            search: { previousPage: '/markdown-editor', section: 'editor' },
        })
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
        <ErrorBoundary>
            <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                <Navbar>
                    <div></div>
                    <Typography.Title level={2} style={{ textAlign: 'center' }}>
                        Editor
                    </Typography.Title>
                    <Popconfirm
                        title="Potential Unsaved Changes"
                        description="Have you saved your changes? Any unsaved changes will be lost."
                        okText="Yes"
                        cancelText="No"
                        onConfirm={goToHelpPage}
                    >
                        <Button icon={<HelpIcon />}>Help</Button>
                    </Popconfirm>
                </Navbar>
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
                        bottom: 0,
                        position: 'fixed',
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                        backgroundColor: 'white',
                        zIndex: '10',
                        paddingTop: '20px',
                        paddingBottom: '20px',
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
