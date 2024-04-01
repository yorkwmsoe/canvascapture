import { Config } from '@renderer/utils/config'
import { useSettingsStore } from '@renderer/stores/settings.store'
import { useNavigate } from '@tanstack/react-router'
import { Button, Checkbox, Form, Input, Typography } from 'antd'
import { Navbar } from '@renderer/components/Navbar'
import { LeftArrowIcon } from '@renderer/components/icons/LeftArrow'

export function SettingsPage() {
    const {
        setCanvasDomain,
        setCanvasAccessToken,
        setMarkdownEditor,
        canvasDomain,
        canvasAccessToken,
        markdownEditor,
    } = useSettingsStore()
    const isSetup = false
    const navigate = useNavigate({ from: isSetup ? '/startup' : '/settings' })

    const onFinish = (values: Config) => {
        setCanvasDomain(values.canvasDomain)
        setCanvasAccessToken(values.canvasAccessToken)
        setMarkdownEditor(values.markdownEditor)
        navigate({ to: '/' })
    }

    const goToHomePage = () => {
        navigate({ to: '/' })
    }

    return (
        <div>
            <Navbar>
                <Button onClick={goToHomePage} icon={<LeftArrowIcon />}>
                    Back
                </Button>
            </Navbar>
            <div>
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
                        <Input />
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
                        </Form.Item>
                    )}
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Save
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}
