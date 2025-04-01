/**
 * Defines the Generate react component which shows a loading screen,
 * while performing the generation behind the scenes
 *
 * See the definition below for more details
 */
import { App, Flex, Spin, Typography } from 'antd'
import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useGenerateNext } from '@renderer/components/Generate/useGenerateNext'

export function Generate() {
    const { notification } = App.useApp()
    const navigate = useNavigate({ from: '/generation' })
    const { runPreGenerate, runGenerate } = useGenerateNext()

    const runGenerateProcess = async () => {
        try {
            // Call the pre-generation step (fetches and generates report content).
            await runPreGenerate()

            // Call the generation step (creates and saves actual report).
            await runGenerate()

            // If successful, display success message, and navigate back to the home page
            notification.destroy()
            notification.success({
                message: 'Success',
                description: 'Report Successfully Generated!',
            })
            navigate({ to: '/' })
        } catch (error: unknown) {
            let errorMessage =
                'Something went wrong during generation. Please try again.'

            if (error instanceof Error) {
                errorMessage = error.message // Safely access the error message
            }

            notification.destroy()
            notification.error({
                message: 'Generation Failed',
                description: errorMessage,
            })
        }
    }

    // Trigger the generation process
    useEffect(() => {
        const run = async () => {
            await runGenerateProcess()
        }
        run()
    }, [])

    // Spinner while the process is running
    return (
        <Flex
            justify="center"
            align="center"
            style={{ height: '100%', flexDirection: 'column' }}
        >
            <Spin />
            <Typography.Text>Generating</Typography.Text>
        </Flex>
    )
}
