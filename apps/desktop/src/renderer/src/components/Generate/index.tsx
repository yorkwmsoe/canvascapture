import { Checkbox, Spin } from 'antd'
import { useMemo } from 'react'
import { useAssignments } from '@renderer/hooks/useAssignments'
import { useCourses } from '@renderer/hooks/useCourses'
import { generate } from './generate'
import { parseHierarchyId } from '@renderer/utils/assignments'

export function Generate() {
  const { assignments, selectedAssignments } = useAssignments()
  const { courses, selectedCourses } = useCourses()
  if (courses !== undefined && assignments !== undefined) {
    generate(
      courses.filter((x) => selectedCourses.includes(x.id)),
      assignments.filter((x) => {
        const splitIds = selectedAssignments.map((y) => parseHierarchyId(y))
        return x
      })
    )
  }

  return <Spin />
}
