import { Config } from '@renderer/utils/config'
import { useSettingsStore } from '@renderer/stores/settings.store'
import { useNavigate, useRouterState } from '@tanstack/react-router'
import { Button, Checkbox, Flex, Form, Input, Typography } from 'antd'
import { Navbar } from '@renderer/components/Navbar'
import { LeftArrowIcon } from '@renderer/components/icons/LeftArrow'
import { useState } from 'react'
import { ExternalLink } from '@renderer/components/ExternalLink'
import { getCurrentWindow } from '@electron/remote'
import { ErrorBoundary } from '@renderer/components/ErrorBoundary'

export function SettingsPage() {
    const {
        setCanvasDomain,
        setCanvasAccessToken,
        setMarkdownEditor,
        setIsStudent,
        canvasDomain,
        canvasAccessToken,
        markdownEditor,
        isStudent,
    } = useSettingsStore()
    const isSetup = useRouterState().location.pathname.includes('/setup')
    const navigate = useNavigate({ from: isSetup ? '/setup' : '/settings' })

    const [currentCanvasDomain, setCurrentCanvasDomain] =
        useState<string>(canvasDomain)

    const goToHomePage = () => {
        navigate({ to: '/' })
    }

    const onFinish = (values: Config) => {
        setCanvasDomain(values.canvasDomain)
        setCanvasAccessToken(values.canvasAccessToken)
        setMarkdownEditor(values.markdownEditor)
        setIsStudent(values.isStudent)
        if (isSetup) {
            getCurrentWindow().reload()
        } else {
            goToHomePage()
        }
    }

    return (
        <ErrorBoundary>
            <div>
                <Navbar>
                    <Button onClick={goToHomePage} icon={<LeftArrowIcon />}>
                        Back
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
                            canvasDomain,
                            canvasAccessToken,
                            markdownEditor,
                            isStudent,
                        }}
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item<Config>
                            label="Canvas Domain"
                            name="canvasDomain"
                            rules={[
                                {
                                    required: true,
                                    message: 'Canvas domain is missing',
                                },
                            ]}
                        >
                            <Input
                                onChange={(e) =>
                                    setCurrentCanvasDomain(
                                        e.currentTarget.value
                                    )
                                }
                            />
                        </Form.Item>
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
                                    href={`${currentCanvasDomain}/profile/settings#access_tokens_holder`}
                                >
                                    Click Here To Create A New Access Token (you
                                    may have to scroll down)
                                </ExternalLink>
                            }
                        >
                            <Input.Password />
                        </Form.Item>
                        {!isSetup && (
                            <Form.Item<Config>
                                name="markdownEditor"
                                valuePropName="checked"
                                wrapperCol={{ offset: 8, span: 16 }}
                            >
                                <Checkbox>Show Markdown Editor</Checkbox>
                                <span
                                    title={
                                        'The Markdown Editor allows for editing the generated PDFs prior to saving.'
                                    }
                                    style={{ fontSize: 20, color: 'blue' }}
                                >
                                    ⓘ
                                </span>
                            </Form.Item>
                        )}
                        <Form.Item<Config>
                            name="isStudent"
                            valuePropName="checked"
                            wrapperCol={{ offset: 8, span: 16 }}
                        >
                            <Checkbox>
                                Student Mode (enable if you are a student)
                            </Checkbox>
                            <span
                                title={
                                    'If the Access Token is for a Student Account, check this box.'
                                }
                                style={{ fontSize: 20, color: 'blue' }}
                            >
                                ⓘ
                            </span>
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                Save
                            </Button>
                        </Form.Item>
                    </Form>
                </Flex>
            </div>
        </ErrorBoundary>
    )
}
