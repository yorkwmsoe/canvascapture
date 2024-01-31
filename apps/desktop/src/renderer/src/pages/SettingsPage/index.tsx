import { Config } from '@renderer/lib/config'
import { useSettingsStore } from '@renderer/stores/settings.store'
import { Button, Checkbox, Form, Input } from 'antd'

type FieldType = {
  advancedMarkdown?: string
} & Config

export function SettingsPage() {
  const { setCanvasDomain, setCanvasAccessToken, canvasDomain, canvasAccessToken } =
    useSettingsStore()
  const isSetup = false

  const onFinish = (values: FieldType) => {
    setCanvasDomain(values.canvasDomain)
    setCanvasAccessToken(values.canvasAccessToken)
  }

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ username: canvasDomain, accessToken: canvasAccessToken }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item<FieldType>
        label="Canvas Domain"
        name="canvasDomain"
        rules={[
          {
            required: true,
            message: 'Canvas domain is missing'
          }
        ]}
      >
        <Input placeholder="msoe.instructure.com" />
      </Form.Item>
      <Form.Item<FieldType>
        label="Canvas Access Token"
        name="canvasAccessToken"
        rules={[{ required: true, message: 'Canvas access token is missing' }]}
      >
        <Input.Password placeholder="XXXX~..." />
      </Form.Item>
      {!isSetup && (
        <Form.Item<FieldType>
          name="advancedMarkdown"
          valuePropName="unchecked"
          wrapperCol={{ offset: 8, span: 16 }}
        >
          <Checkbox>Show Markdown Editor</Checkbox>
        </Form.Item>
      )}
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}
