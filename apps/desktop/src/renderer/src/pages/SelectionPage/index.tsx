/**
 * Defines the SelectionPage
 *
 * See the definition below for more details
 */
import { ErrorBoundary } from '@renderer/components/ErrorBoundary'
import { Navbar } from '@renderer/components/Navbar'
import { SwitchStepper } from '@renderer/components/SwitchStepper'
import { LeftArrowIcon } from '@renderer/components/icons/LeftArrow'
import { useNavigate } from '@tanstack/react-router'
import { Button, Flex } from 'antd'

export function SelectionPage() {
    const navigate = useNavigate()

    const goToHomePage = () => {
        navigate({ to: '/' })
    }

    return (
        <ErrorBoundary>
            <Flex style={{ margin: 20, flex: 1 }} vertical>
                <Navbar>
                    <Button onClick={goToHomePage} icon={<LeftArrowIcon />}>
                        Back
                    </Button>
                </Navbar>
                <SwitchStepper />
            </Flex>
        </ErrorBoundary>
    )
}
