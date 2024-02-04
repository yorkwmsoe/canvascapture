import { useGetAssignments } from '@renderer/apis/canvas.api'
import { useGenerationStore } from '@renderer/stores/generation.store'
import { useCallback, useMemo } from 'react'

export const useAssignments = () => {
  const { assignments: selectedAssignments, setAssignments: setSelectedAssignments } =
    useGenerationStore()
  const assignmentQueries = useGetAssignments()

  const assignments = useMemo(() => {
    return assignmentQueries.map((query) => query.data?.assignments)
  }, [assignmentQueries])

  const getAssignmentsByCourseId = useCallback(
    (courseId: number) => {
      return assignments[courseId]
    },
    [assignments]
  )

  const getAssignmentById = useCallback(
    (courseId: number, assignmentId: number) => {
      return assignments[courseId]?.find((assignment) => assignment.id === assignmentId)
    },
    [assignments]
  )

  return {
    assignments,
    selectedAssignments,
    setSelectedAssignments,
    getAssignmentsByCourseId,
    getAssignmentById
  }
}
