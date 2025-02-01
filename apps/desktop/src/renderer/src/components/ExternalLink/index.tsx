/**
 * Defines the ExternalLink react component
 *
 * See below for more details
 */
import { Typography } from 'antd'
import { shell } from 'electron'

export type ExternalLinkProps = {
    href?: string
    children: React.ReactNode
}

export function ExternalLink({ href, children }: ExternalLinkProps) {
    return (
        <Typography.Link onClick={() => href && shell.openExternal(href)}>
            {children}
        </Typography.Link>
    )
}
