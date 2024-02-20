import { useCallback, useMemo, useState } from 'react'
import { Button, Steps, theme } from 'antd'
import { Assignments } from '../Assignments'
import { Courses } from '../Courses'
import { useCourses } from '@renderer/hooks/useCourses'
import { useAssignments } from '@renderer/hooks/useAssignments'
import { useNavigate } from '@tanstack/react-router'

const STEPS = [
  {
    title: 'Courses',
    content: <Courses />
  },
  {
    title: 'Assignments',
    content: <Assignments />
  }
] as const

export function SwitchStepper() {
  const { token } = theme.useToken()
  const [current, setCurrent] = useState(0)
  const { selectedCourses } = useCourses()
  const { selectedAssignments } = useAssignments()
  const navigate = useNavigate()

  const next = useCallback(() => {
    if (current !== STEPS.length - 1) {
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

  return (
    <>
      <Steps current={current} items={items} />
      <div
        style={{
          minHeight: 200,
          color: token.colorTextTertiary,
          borderRadius: token.borderRadiusLG,
          padding: 24,
          border: `1px dashed ${token.colorBorder}`,
          marginTop: 16
        }}
      >
        {STEPS[current].content}
      </div>
      <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
        {current > 0 && <Button onClick={prev}>Previous</Button>}
        {current < STEPS.length - 1 && (
          <Button
            style={{ marginLeft: 'auto' }}
            type="primary"
            onClick={next}
            disabled={
              (STEPS[current].title === 'Courses' && selectedCourses.length === 0) ||
              (STEPS[current].title === 'Assignments' && selectedAssignments.length === 0)
            }
          >
            Next
          </Button>
        )}
        {current === STEPS.length - 1 && (
          <Button type="primary" onClick={() => navigate({ to: '/generation' })}>
            Done
          </Button>
        )}
      </div>
    </>
  )
}
