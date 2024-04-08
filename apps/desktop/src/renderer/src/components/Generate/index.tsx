import { Flex, Spin, Typography } from 'antd'
import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useGenerate } from './useGenerate'

export function Generate() {
    const navigate = useNavigate({ from: '/generation' })
    const { runGenerate } = useGenerate()

    useEffect(() => {
        const run = async () => {
            await runGenerate()
            navigate({ to: '/' })
        }
        run()
    }, [])

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
