import { Input, Layout, Button, Space, Card, Flex, Form } from 'antd'
import { useNavigate } from '@tanstack/react-router'
import { useGetFolders } from '@renderer/hooks/useGetFolders'
import { FileMarkdownOutlined } from '@ant-design/icons'
import { useGenerationStore } from '@renderer/stores/generation.store'
import { shell } from 'electron'
import { getDocumentsPath } from '@renderer/utils/config'
import { useEffect } from 'react'
import { useAssignments } from '@renderer/hooks/useAssignments'
import { useCourses } from '@renderer/hooks/useCourses'
import { join } from 'path'

const { Header, Content, Footer } = Layout
const { Meta } = Card

type GenerationNameForm = {
    generationName: string
}

export function HomePage() {
    const { setGenerationName } = useGenerationStore()
    const navigate = useNavigate({ from: '/' })
    const { data: folder, refetch: refreshFolders } = useGetFolders()
    const { setSelectedAssignments } = useAssignments()
    const { setSelectedCourses } = useCourses()

    useEffect(() => {
        setSelectedCourses([])
        setSelectedAssignments([])
        refreshFolders()
    }, [])

    const generate = (values: GenerationNameForm) => {
        setGenerationName(values.generationName)
        goToCoursesPage()
    }

    const goToCoursesPage = () => {
        navigate({ to: '/selection' })
    }

    const goToSettingsPage = () => {
        navigate({ to: '/settings' })
    }

    return (
        <Layout>
            <Header
                style={{
                    backgroundColor: 'white',
                    textAlign: 'left',
                    paddingLeft: 5,
                    fontSize: `clamp(${12}px, 2vw, ${40}px`,
                }}
            >
                <Flex justify={'space-between'} align={'center'}>
                    <text style={{ font: '12' }}>
                        <b>Canvas Capture</b>
                    </text>
                    <Button
                        style={{
                            fontSize: `clamp(${12}px, 2vw, ${40}px`,
                            height: 'auto',
                            textAlign: 'center',
                        }}
                        onClick={goToSettingsPage}
                    >
                        Settings
                    </Button>
                </Flex>
            </Header>

            <Content
                style={{
                    margin: 'auto',
                    verticalAlign: 'middle',
                    alignItems: 'center',
                    height: 'clamp(300px, 70vh, 700px)',
                    width: '80%',
                    minWidth: 300,
                    justifyItems: 'center',
                    marginTop: 10,
                }}
            >
                <Form
                    name="generationNameForm"
                    onFinish={generate}
                    autoComplete="off"
                    style={{ width: '50%', margin: 'auto' }}
                >
                    <Form.Item<GenerationNameForm>
                        name="generationName"
                        rules={[
                            {
                                required: true,
                                message: 'Report name is required',
                            },
                        ]}
                    >
                        <Flex align={'center'} justify={'center'}>
                            <Space.Compact style={{ width: '100%' }}>
                                <Input
                                    placeholder="Report name"
                                    style={{
                                        fontSize: 'clamp(15px, 2.5vh, 40px)',
                                        height: 'auto',
                                    }}
                                />
                                <Button
                                    htmlType="submit"
                                    type="primary"
                                    style={{
                                        fontSize: 'clamp(15px, 2.5h, 40px)',
                                        height: 'auto',
                                    }}
                                >
                                    Start
                                </Button>
                            </Space.Compact>
                        </Flex>
                    </Form.Item>
                </Form>
                <Flex
                    align={'center'}
                    justify={'center'}
                    style={{
                        paddingTop: 15,
                        width: '100%',
                        justifyContent: 'center',
                    }}
                >
                    <Flex
                        align={'center'}
                        justify={'center'}
                        style={{ flexWrap: 'wrap', justifyContent: 'unset' }}
                    >
                        {folder?.map((folder) => (
                            <FolderCard
                                key={folder}
                                folder={folder}
                            ></FolderCard>
                        ))}
                    </Flex>
                </Flex>
            </Content>
            <Footer
                style={{
                    backgroundColor: 'white',
                    color: 'gray',
                    paddingLeft: 5,
                    textAlign: 'left',
                }}
            >
                <text>v0.01</text>
            </Footer>
        </Layout>
    )
}

type FolderCardProps = {
    folder: string
}

function FolderCard({ folder }: FolderCardProps) {
    return (
        <Card
            hoverable={true}
            style={{
                minWidth: 175,
                maxWidth: 175,
                width: 175,
                textAlign: 'center',
            }}
            onClick={() => shell.openPath(join(getDocumentsPath(), folder))}
        >
            <FileMarkdownOutlined />
            <Meta title={folder} />
        </Card>
    )
}
