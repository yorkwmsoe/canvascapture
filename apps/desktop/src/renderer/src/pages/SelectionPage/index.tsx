import { SwitchStepper } from '@renderer/components/SwitchStepper'
import { useNavigate } from '@tanstack/react-router'
import { Button } from 'antd'

export function SelectionPage() {
    const navigate = useNavigate()

    const goToHomePage = () => {
        navigate({ to: '/' })
    }

    return (
        <div>
            <Button
                style={{
                    marginLeft: 20,
                    marginTop: 20,
                    fontSize: `clamp(${12}px, 1.5vw, ${40}px`,
                    textAlign: 'center',
                    height: 'auto',
                }}
                onClick={goToHomePage}
            >
                {'\u2B05'}Back
            </Button>
            <div style={{ padding: '10vw' }}>
                <SwitchStepper />
            </div>
        </div>
    )
}
