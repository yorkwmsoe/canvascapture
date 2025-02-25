/**
 * Defines the HomePage and the related FolderCard
 *
 * See the individual definitions for more details
 */
import {
    Input,
    Layout,
    Button,
    Space,
    Card,
    Flex,
    Form,
    Typography,
    Image,
    Collapse,
} from 'antd'
import { useNavigate } from '@tanstack/react-router'
import { useGetFolders } from '@renderer/hooks/useGetFolders'
import { FilePdfOutlined } from '@ant-design/icons'
import { useGenerationStore } from '@renderer/stores/generation.store'
import { shell } from 'electron'
import { doesConfigExist, getDocumentsPath } from '@renderer/utils/config'
import { useEffect } from 'react'
import { useAssignments } from '@renderer/hooks/useAssignments'
import { useCourses } from '@renderer/hooks/useCourses'
import { join } from 'path'
import { Navbar } from '@renderer/components/Navbar'
import { ErrorBoundary } from '@renderer/components/ErrorBoundary'
import { GearIcon } from '@renderer/components/icons/Gear'
import icon from '@renderer/resources/icon.png'

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
        <ErrorBoundary>
            <Layout
                style={{
                    height: '100%',
                }}
            >
                <Navbar>
                    <Typography.Title
                        level={4}
                        style={{
                            margin: 0,
                            height: 20,
                            justifyContent: 'center',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <Image
                            src={icon}
                            height={'100%'}
                            preview={false}
                            style={{ paddingRight: 5 }}
                        ></Image>
                        Canvas Capture
                    </Typography.Title>
                    <Button onClick={goToSettingsPage} icon={<GearIcon />}>
                        Settings
                    </Button>
                </Navbar>
                <Content
                    style={{
                        margin: 'auto',
                        verticalAlign: 'middle',
                        alignItems: 'center',
                        width: '80%',
                        minWidth: 300,
                        justifyItems: 'center',
                        marginTop: 'auto',
                        flexGrow: 0,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <h1>Create a New Report</h1>
                    <Form
                        name="generationNameForm"
                        onFinish={generate}
                        autoComplete="off"
                        style={{
                            width: '100%',
                            maxWidth: '500px',
                            margin: 'auto',
                        }}
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
                                        id="generationNameInput"
                                    />
                                    <Button
                                        htmlType="submit"
                                        type="primary"
                                        style={{
                                            fontSize: '1.25rem',
                                            height: 'auto',
                                        }}
                                        id="generationNameButton"
                                    >
                                        Start
                                    </Button>
                                </Space.Compact>
                            </Flex>
                        </Form.Item>
                    </Form>
                    {folder !== undefined && folder.length > 0 ? ( // If there are no previously generated reports, don't display this section.
                        <Collapse>
                            <Collapse.Panel
                                header="Previously Generated Reports"
                                key="1"
                            >
                                <Flex
                                    align={'center'}
                                    justify={'center'}
                                    style={{
                                        flexWrap: 'wrap',
                                        overflow: 'auto',
                                    }}
                                >
                                    {folder?.map((folder) => (
                                        <FolderCard
                                            key={folder}
                                            folder={folder}
                                        ></FolderCard>
                                    ))}
                                </Flex>
                            </Collapse.Panel>
                        </Collapse>
                    ) : (
                        <></>
                    )}
                </Content>
                <Footer
                    style={{
                        backgroundColor: 'white',
                        color: 'gray',
                        paddingLeft: 5,
                        textAlign: 'left',
                    }}
                >
                    <Typography.Text>v{__APP_VERSION__}</Typography.Text>
                </Footer>
            </Layout>
        </ErrorBoundary>
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
                border: 'black 1px solid',
                margin: '2px',
            }}
            onClick={() => shell.openPath(join(getDocumentsPath(), folder))}
        >
            <FilePdfOutlined />
            <Meta title={folder} />
        </Card>
    )
}
