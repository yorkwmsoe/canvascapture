/**
 * Defines the SwitchStepper react component
 *
 * See the definition below for more details
 */
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
import { RightArrowIcon } from '@renderer/components/icons/RightArrow'
import { LeftArrowIcon } from '@renderer/components/icons/LeftArrow'
import { CheckIcon } from '@renderer/components/icons/Check'
import { Navbar } from '@renderer/components/Navbar'
import { HelpIcon } from '@renderer/components/icons/Help'

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
        description: 'Statistics',
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
        if (STEPS[current].title === 'Statistics' && markdownEditor) {
            navigate({ to: '/markdown-editor' })
        } else if (current !== STEPS.length - 1) {
            setCurrent((prev) => prev + 1)
        }
    }, [current])

    const prev = useCallback(() => {
        if (current !== 0) {
            setCurrent((prev) => prev - 1)
        } else {
            navigate({ to: '/' })
        }
    }, [current])

    const items = useMemo(
        () =>
            STEPS.map((item) => ({
                key: item.title,
                title:
                    markdownEditor && item.title == 'Generate'
                        ? 'Editor'
                        : item.title,
            })),
        [STEPS]
    )

    const isDisabled =
        (STEPS[current].title === 'Courses' && selectedCourses.length === 0) ||
        (STEPS[current].title === 'Assignments' &&
            selectedAssignments.length === 0)

    const goToHelpPage = () => {
        navigate({
            to: '/help',
            search: {
                previousPage: '/selection',
                section: 'process',
                step: current,
            },
        })
    }

    return (
        <>
            <Navbar>
                <div></div>
                <Button
                    style={{ marginTop: -20 }}
                    onClick={goToHelpPage}
                    icon={<HelpIcon />}
                >
                    Help
                </Button>
            </Navbar>
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
                <Button onClick={prev} icon={<LeftArrowIcon />}>
                    Previous
                </Button>
                {current < STEPS.length - 1 && (
                    <Button
                        style={{ marginLeft: 'auto' }}
                        type="primary"
                        onClick={next}
                        disabled={isDisabled}
                        id="nextButton"
                        icon={
                            STEPS[current + 1].title === 'Generate' &&
                            !markdownEditor ? (
                                <CheckIcon />
                            ) : (
                                <RightArrowIcon />
                            )
                        }
                    >
                        {STEPS[current + 1].title === 'Generate' &&
                        !markdownEditor
                            ? 'Generate'
                            : 'Next'}
                    </Button>
                )}
            </div>
        </>
    )
}
