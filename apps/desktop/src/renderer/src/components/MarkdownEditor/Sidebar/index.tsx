/**
 * Defines the Sidebar react component used in the Markdown Editor
 *
 * See the definition below for more details
 */
import { Button } from 'antd'
import { SaveIcon } from '@renderer/components/icons/Save'

export type SideBarProps = {
    onSave?: () => void
}

export function SideBar({ onSave }: SideBarProps) {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                flex: 1,
            }}
        >
            <Button onClick={onSave} block icon={<SaveIcon />}>
                Save Changes
            </Button>
        </div>
    )
}
