import { Button, Spin } from 'antd'
import { useAssignments } from '@renderer/hooks/useAssignments'
import { useCourses } from '@renderer/hooks/useCourses'
import { generate } from './generate'
import { parseHierarchyId } from '@renderer/utils/assignments'
import { useState } from 'react'
import { useSettingsStore } from '@renderer/stores/settings.store'

type GenState = 'not-started' | 'started' | 'done'

export function Generate() {
  const { selectedAssignments, getAssignmentById } = useAssignments()
  const { courses, selectedCourses } = useCourses()
  const selectedAssignmentsSplit = selectedAssignments.map((x) => parseHierarchyId(x))
  const [genState, setGenState] = useState<GenState>('not-started')
  const { canvasDomain, canvasAccessToken } = useSettingsStore()

  const runGenerate = async () => {
    setGenState('started')
    await generate(
      courses?.filter((x) => selectedCourses.includes(x.id)),
      selectedAssignmentsSplit.flatMap(
        ({ courseId, assignmentId }) => getAssignmentById(courseId, assignmentId) ?? []
      ),
      canvasAccessToken,
      canvasDomain
    )
    setGenState('done')
  }

  switch (genState) {
    case 'not-started':
      return (
        <Button type="primary" onClick={runGenerate}>
          Generate
        </Button>
      )
    case 'started':
      return <Spin />
    default:
      return <></>
  }
}
