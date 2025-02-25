/**
 * Defines the SelectionPage
 *
 * See the definition below for more details
 */
import { ErrorBoundary } from '@renderer/components/ErrorBoundary'
import { SwitchStepper } from '@renderer/components/SwitchStepper'
import { Flex } from 'antd'

export function SelectionPage() {
    return (
        <ErrorBoundary>
            <Flex style={{ margin: 20, flex: 1 }} vertical>
                <SwitchStepper />
            </Flex>
        </ErrorBoundary>
    )
}
