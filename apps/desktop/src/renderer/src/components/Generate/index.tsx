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
import { useGenerationStore } from '@renderer/stores/generation.store'
import fs from 'fs'
import path from 'path'

export function Generate() {
    const { notification } = App.useApp()
    const navigate = useNavigate({ from: '/generation' })
    const { runPreGenerate, runGenerate } = useGenerateNext()
    const { generationName, courses, assignments } = useGenerationStore()
    const runGenerateProcess = async () => {
        try {
            // Call the pre-generation step (fetches and generates report content).
            await runPreGenerate()

            // Call the generation step (creates and saves actual report).
            await runGenerate()

            // If successful, navigate back to the home page
            navigate({ to: '/' })
            const dataToWrite = {
                myString: generationName,
                myNumbers: courses,
                myStrings: assignments,
            }
            try {
                const filePath = path.join(
                    __dirname,
                    '../../../../../../../../../assignmentsConfig.json'
                )
                fs.writeFileSync(
                    filePath,
                    JSON.stringify(dataToWrite, null, 2),
                    'utf-8'
                )
            } catch (error) {
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
