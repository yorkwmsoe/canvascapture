import { Input, Layout, Button, Space, Card, Flex, Col, Row } from 'antd'
import { useNavigate } from '@tanstack/react-router'
import { useGetFolders } from '@renderer/hooks/useGetFolders'
import { FileMarkdownOutlined } from '@ant-design/icons'
import { useGenerationStore } from '@renderer/stores/generation.store'

const { Header, Content, Footer } = Layout
const { Meta } = Card
export function HomePage() {
  // TODO: Hook up name to the geration store
  const { generationName, setGenerationName } = useGenerationStore()
  const navigate = useNavigate({ from: '/' })
  const { data: folder } = useGetFolders()

  const generate = () => {
    if (generationName !== '') {
      goToCoursesPage()
    } else {
      const generationModal = document.getElementById('generationModal')
      if (generationModal) {
        generationModal.hidden = false
      }
    }
  }

  const goToCoursesPage = () => {
    navigate({ to: '/selection' })
  }

  const openSettingsPage = () => {
    navigate({ to: '/settings' })
  }

  const exitGenerationNameWarning = () => {
    const generationModal = document.getElementById('generationModal')
    if (generationModal) {
      generationModal.hidden = true
    }
  }

  return (
    <Layout>
      <Header style={{ backgroundColor: 'white', textAlign: 'left', paddingLeft: 5 }}>
        <text style={{ font: '12' }}>
          <b>Canvas Capture</b>
        </text>
        <Button style={{ left: '88%' }} onClick={() => openSettingsPage()}>
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
          justifyItems: 'center'
        }}
      >
        <div>
          <Flex align={'center'} justify={'center'}>
            <Space.Compact>
              <Input
                style={{ width: '350px' }}
                placeholder={'Generation name'}
                value={generationName}
                onChange={(e) => setGenerationName(e.target.value)}
              />
              <Button onClick={() => generate()} style={{ color: 'white', background: '#051631' }}>
                Generate
              </Button>
            </Space.Compact>
            <div
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                background: '#051631',
                color: 'white',
                borderRadius: '8px',
                width: '250px',
                textAlign: 'center'
              }}
              className={'modal'}
              hidden={true}
              id={'generationModal'}
            >
              <div className={'modal-header'}>
                <Space.Compact>
                  <h3>ENTER GENERATION NAME!</h3>
                  <span className={'close'} onClick={() => exitGenerationNameWarning()}>
                    &times;
                  </span>
                </Space.Compact>
              </div>
              <div className={'modal-content'}>Please Enter A Name For The Generation.</div>
            </div>
          </Flex>
        </div>
        <div>
          <Flex align={'center'} justify={'center'} style={{ paddingTop: 15 }}>
            <div>
              <Row gutter={8}>
                {folder?.map((folder) => <FolderCard key={folder} folder={folder}></FolderCard>)}
              </Row>
            </div>
          </Flex>
        </div>
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
    <Col key={folder} span={8}>
      <Card
        hoverable={true}
        style={{ width: 100, height: 70 }}
        cover={<FileMarkdownOutlined size={15} />}
      >
        <Meta title={folder} />
      </Card>
    </Col>
  )
}
