/**
 * Defines the SettingsPage
 *
 * See the definition below for more details
 */
import { Config } from '@renderer/utils/config'
import { useSettingsStore } from '@renderer/stores/settings.store'
import { useNavigate, useRouterState } from '@tanstack/react-router'
import { Button, Checkbox, Flex, Form, Input, Layout, Typography } from 'antd'
import { Navbar } from '@renderer/components/Navbar'
import { HomeIcon } from '@renderer/components/icons/Home'
import { ExternalLink } from '@renderer/components/ExternalLink'
import { getCurrentWindow } from '@electron/remote'
import { ErrorBoundary } from '@renderer/components/ErrorBoundary'
import { useQueryClient } from '@tanstack/react-query'
import { SaveIcon } from '@renderer/components/icons/Save'
import { HelpIcon } from '@renderer/components/icons/Help'
import fs from 'fs'
import path from 'path'

export function SettingsPage() {
    const {
        setCanvasAccessToken,
        setMarkdownEditor,
        canvasDomain,
        canvasAccessToken,
        markdownEditor,
    } = useSettingsStore()
    const queryClient = useQueryClient()
    const isSetup = useRouterState().location.pathname.includes('/setup')
    const navigate = useNavigate({ from: isSetup ? '/setup' : '/settings' })
    let gitHubCAPIToken: string = ''
    let chaseLinks: boolean = false
    const goToHomePage = () => {
        navigate({ to: '/' })
    }

    const goToHelpPage = () => {
        navigate({
            to: '/help',
            search: {
                previousPage: isSetup ? '/setup' : '/settings',
                section: 'settings',
            },
        })
    }

    const updateGithubClassToken = (token) => {
        gitHubCAPIToken = token
    }
    const updateChaseLinks = (cL) => {
        chaseLinks = cL.target.checked
    }

    const readSettings = () => {
        const settingsFilePath = path.join(
            __dirname,
            '../../../../../../../../../apps/desktop/src/renderer/src/apis/LinkSettings.json'
        )
        if (fs.existsSync(settingsFilePath)) {
            try {
                const fileData = fs.readFileSync(settingsFilePath, 'utf-8')
                return JSON.parse(fileData)
            } catch (error) {
                return { gitHubClassroomToken: '', chaseLinks: false } // Default values
            }
        }
        return { gitHubClassroomToken: '', chaseLinks: false } // Default values
    }

    // Get settings at render time
    const settings = readSettings()

    const writeStateToFile = (
        gitHubClassroomToken: string,
        chaseLinks: boolean
    ) => {
        // Only write gitHubClassroomToken and chaseLinks to the file
        const settingsFilePath = path.join(
            __dirname,
            '../../../../../../../../../apps/desktop/src/renderer/src/apis/LinkSettings.json'
        )
        ensureFileExists(settingsFilePath)

        const settingsToSave = { gitHubClassroomToken, chaseLinks }
        
        fs.writeFile(
            settingsFilePath,
            JSON.stringify(settingsToSave),
            (_) => {
                if (_) {
                    //Do nothing
                }
            }
        )
    }
    const ensureFileExists = (settingsFilePath) => {
        const directory = path.dirname(settingsFilePath)

        // Ensure the directory exists
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true })
        }

        // Ensure the file exists (if not, create it)
        if (!fs.existsSync(settingsFilePath)) {
            fs.writeFileSync(settingsFilePath, '{}') // Create an empty JSON file
        }
    }

    const onFinish = (values: Config) => {
        setCanvasAccessToken(values.canvasAccessToken)
        setMarkdownEditor(values.markdownEditor)

        writeStateToFile(gitHubCAPIToken, chaseLinks)

        queryClient.invalidateQueries({ queryKey: ['courses'] })
        if (isSetup) {
            getCurrentWindow().reload()
        } else {
            goToHomePage()
        }
    }

    return (
        <ErrorBoundary>
            <Layout
                style={{
                    height: '100%',
                }}
            >
                <Navbar>
                    <Button onClick={goToHomePage} icon={<HomeIcon />}>
                        Home
                    </Button>
                    <Button onClick={goToHelpPage} icon={<HelpIcon />}>
                        Help
                    </Button>
                </Navbar>
                <Flex justify="center" vertical>
                    <Typography.Title level={2} style={{ textAlign: 'center' }}>
                        Settings
                    </Typography.Title>
                    <Form
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        style={{ maxWidth: '90%' }}
                        initialValues={{
                            canvasAccessToken,
                            markdownEditor,
                        }}
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item<Config>
                            label="Canvas Access Token"
                            name="canvasAccessToken"
                            rules={[
                                {
                                    required: true,
                                    message: 'Canvas access token is missing',
                                },
                            ]}
                            extra={
                                <ExternalLink
                                    href={`${canvasDomain}/profile/settings#access_tokens_holder`}
                                >
                                    Click Here To Create A New Access Token (you
                                    may have to scroll down)
                                </ExternalLink>
                            }
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item<Config>
                            label="Github Classroom Token"
                            rules={[
                                {
                                    required: false,
                                    message:
                                        'GitHub Classroom Token is missing',
                                },
                            ]}
                        >
                            <Input
                                type="password"
                                onChange={(e) =>
                                    updateGithubClassToken(
                                        e.currentTarget.value
                                    )
                                }
                                defaultValue={settings.gitHubClassroomToken}
                            />
                        </Form.Item>
                        <Form.Item<Config>
                            valuePropName="checked"
                            wrapperCol={{ offset: 8, span: 16 }}
                            label={
                                <span
                                    title={
                                        'Show Github Clasrrom Descriptions In Readme'
                                    }
                                    style={{ fontSize: 20, color: 'blue' }}
                                >
                                    ⓘ
                                </span>
                            }
                            labelCol={{ style: { order: 2 } }}
                            colon={false}
                        >
                            <Checkbox
                                onChange={(e) => updateChaseLinks(e)}
                                defaultChecked={settings.chaseLinks}
                            >
                                Chase Links (Requires Github Classroom Token)
                            </Checkbox>
                        </Form.Item>
                        {!isSetup && (
                            <Form.Item<Config>
                                name="markdownEditor"
                                valuePropName="checked"
                                wrapperCol={{ offset: 8, span: 16 }}
                                label={
                                    <span
                                        title={
                                            'The editor allows for editing the generated PDFs prior to saving.'
                                        }
                                        style={{ fontSize: 20, color: 'blue' }}
                                    >
                                        ⓘ
                                    </span>
                                }
                                labelCol={{ style: { order: 2 } }}
                                colon={false}
                            >
                                <Checkbox>Show Editor</Checkbox>
                            </Form.Item>
                        )}
                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                icon={<SaveIcon />}
                            >
                                Save
                            </Button>
                        </Form.Item>
                    </Form>
                </Flex>
            </Layout>
        </ErrorBoundary>
    )
}
