/**
 * Defines the Navbar react component
 *
 * See the definition below for more details
 */
import { Flex } from 'antd'

export type NavbarProps = {
    children: React.ReactNode
}

export function Navbar({ children }: NavbarProps) {
    return (
        <Flex
            justify="space-between"
            align="center"
            style={{
                paddingInline: '1rem',
                paddingBlock: '0.5rem',
            }}
        >
            {children}
        </Flex>
    )
}
