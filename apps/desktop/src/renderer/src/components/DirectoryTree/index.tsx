/**
 * Defines the DirectoryTree react component
 *
 * See below for more details
 */
import { Tree } from 'antd'
import type { GetProps } from 'antd'

type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>

export function DirectoryTree(props: DirectoryTreeProps) {
    return <Tree.DirectoryTree {...props} />
}
