/**
 * Defines the Sidebar react component used in the Markdown Editor
 *
 * See the definition below for more details
 */
import { Button, Popconfirm } from 'antd'

export type SideBarProps = {
    onSave?: () => void
    onFinish?: () => void
}

export function SideBar({ onSave, onFinish }: SideBarProps) {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                flex: 1,
            }}
        >
            <Popconfirm
                title="Finish editing"
                description="Are you sure your done editing?"
                okText="Yes"
                cancelText="No"
                onConfirm={onFinish}
            >
                <Button type="primary" block>
                    Finish
                </Button>
            </Popconfirm>
            <Button onClick={onSave} block>
                Save
            </Button>
        </div>
    )
}
