import { Spin, Typography } from 'antd'
import { useAssignments } from '@renderer/hooks/useAssignments'
import { useCourses } from '@renderer/hooks/useCourses'
import { generate } from './generate'
import { parseHierarchyId } from '@renderer/utils/assignments'
import { useEffect } from 'react'
import { useSettingsStore } from '@renderer/stores/settings.store'
import { Course } from '@renderer/types/canvas_api/course'
import { getDocumentsPath } from '@renderer/utils/config'
import { useGenerationStore } from '@renderer/stores/generation.store'
import { useNavigate } from '@tanstack/react-router'

export function GenerationPage() {
  const navigate = useNavigate({ from: '/generation' })
  const { selectedAssignments, getAssignmentById } = useAssignments()
  const { courses, selectedCourses } = useCourses()
  const { canvasDomain, canvasAccessToken } = useSettingsStore()
  const { generationName } = useGenerationStore()

  const outpath = `${getDocumentsPath()}/${generationName}`
  const selectedAssignmentsSplit = selectedAssignments.map((x) => parseHierarchyId(x))
  const filteredAssignments = selectedAssignmentsSplit.flatMap(
    ({ courseId, assignmentId }) => getAssignmentById(courseId, assignmentId) ?? []
  )
  /* Cannot be undefined, as the UI prevents it */
  const filteredCourses = courses?.filter((x) => selectedCourses.includes(x.id)) as Course[]

  const runGenerate = async () => {
    await generate(filteredCourses, filteredAssignments, canvasAccessToken, canvasDomain, outpath)
    navigate({ to: '/' })
  }

  useEffect(() => {
    runGenerate()
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%'
      }}
    >
      <Typography.Text>Generating </Typography.Text>
      <Spin />
    </div>
  )
}
