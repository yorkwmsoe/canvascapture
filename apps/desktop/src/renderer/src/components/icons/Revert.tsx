/**
 * Defines the Revert react component
 *
 * See definition below for more details
 */
import Icon from '@ant-design/icons'
import { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon'

export const RevertIcon = (props: Partial<CustomIconComponentProps>) => (
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
                    d="M9.825 20.7q-2.575-.725-4.2-2.837T4 13q0-1.425.475-2.713t1.35-2.362q.275-.3.675-.313t.725.313q.275.275.288.675t-.263.75q-.6.775-.925 1.7T6 13q0 2.025 1.188 3.613t3.062 2.162q.325.1.537.375t.213.6q0 .5-.35.788t-.825.162Zm4.35 0q-.475.125-.825-.175t-.35-.8q0-.3.213-.575t.537-.375q1.875-.6 3.063-2.175T18 13q0-2.5-1.75-4.25T12 7h-.075l.4.4q.275.275.275.7t-.275.7q-.275.275-.7.275t-.7-.275l-2.1-2.1q-.15-.15-.212-.325T8.55 6q0-.2.063-.375t.212-.325l2.1-2.1q.275-.275.7-.275t.7.275q.275.275.275.7t-.275.7l-.4.4H12q3.35 0 5.675 2.325T20 13q0 2.725-1.625 4.85t-4.2 2.85Z"
                ></path>
            </svg>
        )}
        {...props}
    />
)
