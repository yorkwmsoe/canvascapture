import { useGetAssignments } from '@renderer/apis/canvas.api'
import { useGenerationStore } from '@renderer/stores/generation.store'
import { Assignment } from '@canvas-capture/lib'
import { isObject } from 'lodash'
import { useCallback, useEffect, useMemo } from 'react'
import { App } from 'antd'

export const useAssignments = () => {
    const { message } = App.useApp()
    const {
        assignments: selectedAssignments,
        setAssignments: setSelectedAssignments,
    } = useGenerationStore()
    const assignmentQueries = useGetAssignments()

    const assignments = useMemo(() => {
        return assignmentQueries
            .map((query) => query.data)
            .filter(isObject) as {
            courseId: number
            assignments: Assignment[]
        }[]
    }, [assignmentQueries])

    const getAssignmentsByCourseId = useCallback(
        (courseId: number) => {
            return assignments.find(
                (assignment) => assignment?.courseId === courseId
            )
        },
        [assignments]
    )

    const getAssignmentById = useCallback(
        (courseId: number, assignmentId: number) => {
            return getAssignmentsByCourseId(courseId)?.assignments.find(
                (assignment) => assignment.id === assignmentId
            )
        },
        [assignments]
    )

    const getSubmissionTypesForAssignment = useCallback(
        (courseId: number, assignmentId: number) => {
            const assignment = getAssignmentById(courseId, assignmentId)
            return assignment ? assignment.submission_types : []
        },
        [getAssignmentById]
    )

    useEffect(() => {
        if (assignmentQueries.some((query) => query.isError)) {
            message.error('Failed to fetch assignments')
        }
    }, [assignmentQueries])

    return {
        assignments,
        selectedAssignments,
        setSelectedAssignments,
        getAssignmentsByCourseId,
        getAssignmentById,
        getSubmissionTypesForAssignment,
    }
}
