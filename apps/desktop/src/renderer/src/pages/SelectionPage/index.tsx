import { SwitchStepper } from '@renderer/components/SwitchStepper'
import { useNavigate } from '@tanstack/react-router'
import { Button, Flex } from 'antd'

export function SelectionPage() {
    const navigate = useNavigate()

    const goToHomePage = () => {
        navigate({ to: '/' })
    }

    return (
        <Flex style={{ margin: 20, flex: 1}} vertical>
            <Button
                style={{
                    marginBottom: 20,
                    textAlign: 'center',
                    height: 'min-content',
                    width: 'min-content',
                    fontSize: '1.25rem',
                }}
                onClick={goToHomePage}
            >
                {'\u2B05'}Back
            </Button>
            <SwitchStepper />
        </Flex>
    )
}
