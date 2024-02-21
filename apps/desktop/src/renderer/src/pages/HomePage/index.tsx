import { Input, Layout, Button, Space, Card, Flex, Col, Row, Form } from 'antd'
import { useNavigate } from '@tanstack/react-router'
import { useGetFolders } from '@renderer/hooks/useGetFolders'
import { FileMarkdownOutlined } from '@ant-design/icons'
import { useGenerationStore } from '@renderer/stores/generation.store'
import {shell} from 'electron'
import { getDocumentsPath } from '@renderer/utils/config'

const { Header, Content, Footer } = Layout
const { Meta } = Card

type GenerationNameForm = {
  generationName: string
}

export function HomePage() {
  const { setGenerationName } = useGenerationStore()
  const navigate = useNavigate({ from: '/' })
  const { data: folder } = useGetFolders()

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
      <Header style={{ backgroundColor: 'white', textAlign: 'left', paddingLeft: 5 }}>
        <text style={{ font: '12' }}>
          <b>Canvas Capture</b>
        </text>
        <Button style={{ left: '88%' }} onClick={goToSettingsPage}>
          Settings
        </Button>
      </Header>
      <Content
        style={{
          margin: 'auto',
          width: '50%',
          verticalAlign: 'middle',
          alignItems: 'center',
          height: 'auto',
          minHeight: '490px',
          justifyItems: 'center',
          marginTop: 10
        }}
      >
        <Form
          name="basic"
          onFinish={generate}
          autoComplete="off"
          style={{ width: '70%', margin: 'auto' }}
        >
          <Form.Item<GenerationNameForm>
            name="generationName"
            rules={[
              {
                required: true,
                message: 'Report name is required'
              }
            ]}
          >
            <Flex align={'center'} justify={'center'}>
              <Space.Compact style={{ width: '100%' }}>
                <Input placeholder="Report name" />
                <Button htmlType="submit" style={{ color: 'white', background: '#051631' }}>
                  Generate
                </Button>
              </Space.Compact>
            </Flex>
          </Form.Item>
        </Form>
        <Flex align={'center'} justify={'center'} style={{ paddingTop: 15 }}>
          <Row gutter={8} style={{ justifyContent: 'space-between' }}>
            {folder?.map((folder) => <FolderCard key={folder} folder={folder}></FolderCard>)}
          </Row>
        </Flex>
      </Content>
      <Footer
        style={{ backgroundColor: 'white', color: 'gray', paddingLeft: 5, textAlign: 'left' }}
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
    <Col key={folder} style={{ padding: '5px' }}>
      <Card
        hoverable={true}
        style={{
          width: 175,
          textAlign: 'center'
        }}
        onClick={() => shell.openPath(`${getDocumentsPath()}/${folder}`)}
      >
        <FileMarkdownOutlined />
        <Meta title={folder} />
      </Card>
    </Col>
  )
}
