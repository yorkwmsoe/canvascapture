/**
 * Defines the SettingsPage
 *
 * See the definition below for more details
 */
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
import { useQueryClient } from '@tanstack/react-query'

export function SettingsPage() {
    const {
        setCanvasDomain,
        setCanvasAccessToken,
        setMarkdownEditor,
        canvasDomain,
        canvasAccessToken,
        markdownEditor,
    } = useSettingsStore()
    const queryClient = useQueryClient()
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
        queryClient.invalidateQueries({ queryKey: ['courses'] })
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
                                label={
                                    <span
                                        title={
                                            'The Markdown Editor allows for editing the generated PDFs prior to saving.'
                                        }
                                        style={{ fontSize: 20, color: 'blue' }}
                                    >
                                        ⓘ
                                    </span>
                                }
                                labelCol={{ style: { order: 2 } }}
                                colon={false}
                            >
                                <Checkbox>Show Markdown Editor</Checkbox>
                            </Form.Item>
                        )}
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
