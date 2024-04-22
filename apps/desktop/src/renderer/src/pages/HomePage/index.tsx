import {
    Input,
    Layout,
    Button,
    Space,
    Card,
    Flex,
    Form,
    Typography,
} from 'antd'
import { useNavigate } from '@tanstack/react-router'
import { useGetFolders } from '@renderer/hooks/useGetFolders'
import { FileMarkdownOutlined } from '@ant-design/icons'
import { useGenerationStore } from '@renderer/stores/generation.store'
import { shell } from 'electron'
import { doesConfigExist, getDocumentsPath } from '@renderer/utils/config'
import { useEffect } from 'react'
import { useAssignments } from '@renderer/hooks/useAssignments'
import { useCourses } from '@renderer/hooks/useCourses'
import { join } from 'path'
import { Navbar } from '@renderer/components/Navbar'

const { Content, Footer } = Layout
const { Meta } = Card

type GenerationNameForm = {
    generationName: string
}

export function HomePage() {
    const { setGenerationName, reset } = useGenerationStore()
    const navigate = useNavigate({ from: '/' })
    if (!doesConfigExist()) {
        navigate({ to: '/setup' })
    }
    const { data: folder, refetch: refreshFolders } = useGetFolders()
    const { setSelectedAssignments } = useAssignments()
    const { setSelectedCourses } = useCourses()

    useEffect(() => {
        setSelectedCourses([])
        setSelectedAssignments([])
        refreshFolders()
    }, [])

    const generate = (values: GenerationNameForm) => {
        reset()
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
        <Layout
            style={{
                height: '100%',
            }}
        >
            <Navbar>
                <Typography.Title level={4} style={{ margin: 0 }}>
                    Canvas Capture
                </Typography.Title>
                <Button onClick={goToSettingsPage}>Settings</Button>
            </Navbar>
            <Content
                style={{
                    margin: 'auto',
                    verticalAlign: 'middle',
                    alignItems: 'center',
                    width: '80%',
                    minWidth: 300,
                    justifyItems: 'center',
                    marginTop: 10,
                    flexGrow: 0,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Form
                    name="generationNameForm"
                    onFinish={generate}
                    autoComplete="off"
                    style={{ width: '100%', maxWidth: '500px', margin: 'auto' }}
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
                                        fontSize: '2rem',
                                        height: 'auto',
                                    }}
                                />
                                <Button
                                    htmlType="submit"
                                    type="primary"
                                    style={{
                                        fontSize: '1.25rem',
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
                    style={{ flexWrap: 'wrap', overflow: 'auto' }}
                >
                    {folder?.map((folder) => (
                        <FolderCard key={folder} folder={folder}></FolderCard>
                    ))}
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
                <Typography.Text>v0.01</Typography.Text>
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
