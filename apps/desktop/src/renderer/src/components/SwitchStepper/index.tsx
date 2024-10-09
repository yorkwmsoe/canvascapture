import { useCallback, useMemo, useState } from 'react'
import { Button, Steps, theme } from 'antd'
import { Statistics } from '../Statistics'
import { Assignments } from '../Assignments'
import { Courses } from '../Courses'
import { useCourses } from '@renderer/hooks/useCourses'
import { useAssignments } from '@renderer/hooks/useAssignments'
import { Generate } from '../Generate'
import { useSettingsStore } from '@renderer/stores/settings.store'
import { useNavigate, useSearch } from '@tanstack/react-router'

export const STEPS = [
    {
        title: 'Courses',
        content: <Courses />,
        description: 'Select the course(s) from which to generate the report',
    },
    {
        title: 'Assignments',
        content: <Assignments />,
        description:
            'Select the assignment(s) from which to generate the report',
    },
    {
        title: 'Statistics',
        content: <Statistics />,
    },
    {
        title: 'Generate',
        content: <Generate />,
        description: '',
    },
] as const

export function SwitchStepper() {
    const { step } = useSearch({ from: '/selection' })
    const { token } = theme.useToken()
    const [current, setCurrent] = useState(step ?? 0)
    const { selectedCourses } = useCourses()
    const { selectedAssignments } = useAssignments()
    const { markdownEditor } = useSettingsStore()
    const navigate = useNavigate({ from: '/selection' })

    const next = useCallback(() => {
        if (STEPS[current].title === 'Assignments' && markdownEditor) {
            navigate({ to: '/markdown-editor' })
        } else if (current !== STEPS.length - 1) {
            setCurrent((prev) => prev + 1)
        }
    }, [current])

    const prev = useCallback(() => {
        if (current !== 0) {
            setCurrent((prev) => prev - 1)
        }
    }, [current])

    const items = useMemo(
        () => STEPS.map((item) => ({ key: item.title, title: item.title })),
        [STEPS]
    )

    const isDisabled =
        (STEPS[current].title === 'Courses' && selectedCourses.length === 0) ||
        (STEPS[current].title === 'Assignments' &&
            selectedAssignments.length === 0)

    return (
        <>
            <Steps current={current} items={items} />
            {STEPS[current].title !== 'Generate' && (
                <h4>{STEPS[current].description}</h4>
            )}
            <div
                style={{
                    minHeight: 200,
                    color: token.colorTextTertiary,
                    borderRadius: token.borderRadiusLG,
                    padding: 24,
                    border: `1px dashed ${token.colorBorder}`,
                    marginTop: 16,
                    flex: '1 1 0',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {STEPS[current].content}
            </div>
            <div
                style={{
                    marginTop: 24,
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                {current > 0 && <Button onClick={prev}>Previous</Button>}
                {current < STEPS.length - 1 && (
                    <Button
                        style={{ marginLeft: 'auto' }}
                        type="primary"
                        onClick={next}
                        disabled={isDisabled}
                        id="nextButton"
                    >
                        {STEPS[current + 1].title === 'Generate'
                            ? 'Generate'
                            : 'Next'}
                    </Button>
                )}
            </div>
        </>
    )
}
