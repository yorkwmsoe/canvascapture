import { Navbar } from '@renderer/components/Navbar'
import { SwitchStepper } from '@renderer/components/SwitchStepper'
import { LeftArrowIcon } from '@renderer/components/icons/LeftArrow'
import { useNavigate } from '@tanstack/react-router'
import { Button } from 'antd'

export function SelectionPage() {
    const navigate = useNavigate()

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
            <div style={{ padding: '1rem' }}>
                <SwitchStepper />
            </div>
        </div>
    )
}
