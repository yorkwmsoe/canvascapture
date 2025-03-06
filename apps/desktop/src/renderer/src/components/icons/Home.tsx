/**
 * Defines the Home react component
 *
 * See definition below for more details
 */
import Icon from '@ant-design/icons'
import { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon'

export const HomeIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon
        component={() => (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
            >
                <path
                    fill="currentColor"
                    d="M4 21V9l8-6l8 6v12h-6v-7h-4v7H4Z"
                ></path>
            </svg>
        )}
        {...props}
    />
)
