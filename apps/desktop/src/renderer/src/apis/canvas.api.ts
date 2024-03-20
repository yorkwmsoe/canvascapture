import { useSettingsStore } from '@renderer/stores/settings.store'
import { useQueries, useQuery } from '@tanstack/react-query'
import { useGenerationStore } from '@renderer/stores/generation.store'
import { parseHierarchyId } from '@renderer/utils/assignments'
import {Assignment, Auth, createCanvasApi, GetAssignmentsRequest} from '@canvas-capture/lib'

export const canvasApi = createCanvasApi()


export const getAssignments = async (
    args: GetAssignmentsRequest & Auth
): Promise<{
    courseId: number
    assignments: Assignment[]
}> => {
    return {
        courseId: args.courseId,
        assignments: (
            await canvasApi.getAssignments(
               args))
    }
}


// Hooks
export const useGetSubmissions = () => {
    const { canvasDomain, canvasAccessToken } = useSettingsStore()
    const { assignments } = useGenerationStore()
    return useQueries({
        queries: assignments.map((courseAssignmentId) => {
            const { courseId, assignmentId } =
                parseHierarchyId(courseAssignmentId)
            return {
                queryKey: ['submissions', courseId, assignmentId],
                queryFn: () =>
                    canvasApi.getSubmissions({
                        canvasAccessToken,
                        canvasDomain,
                        courseId,
                        assignmentId,
                    }),
            }
        }),
    })
}

export const useGetAssignments = () => {
    const { canvasDomain, canvasAccessToken } = useSettingsStore()
    const { courses } = useGenerationStore()
    return useQueries({
        queries: courses.map((courseId) => {
            return {
                queryKey: ['assignments', courseId],
                queryFn: () =>
                    getAssignments({
                        canvasAccessToken,
                        canvasDomain,
                        courseId,
                    }),
            }
        }),
    })
}

export const useGetCourses = () => {
    const { canvasDomain, canvasAccessToken } = useSettingsStore()
    return useQuery({
        queryKey: ['courses'],
        queryFn: async () => {
            const courses = await canvasApi.getCourses({
                canvasAccessToken,
                canvasDomain,
            })
            return courses
        },
    })
}
