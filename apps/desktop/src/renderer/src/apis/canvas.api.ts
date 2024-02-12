import { Assignment } from '@renderer/types/canvas_api/assignment'
import { useSettingsStore } from '@renderer/stores/settings.store'
import { useQueries, useQuery } from '@tanstack/react-query'
import axios, { AxiosRequestHeaders } from 'axios'
import { parseISO } from 'date-fns'
import { Course } from '@renderer/types/canvas_api/course'
import { Submission } from '@renderer/types/canvas_api/submission'
import { useGenerationStore } from '@renderer/stores/generation.store'
import { parseHierarchyId } from '@renderer/utils/assignments'

// date handling from: https://stackoverflow.com/a/66238542
export function handleDates(body: unknown) {
  if (body === null || body === undefined || typeof body !== 'object') return

  for (const key of Object.keys(body)) {
    const value = body[key]
    if (
      value &&
      typeof value === 'string' &&
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(value)
    ) {
      body[key] = parseISO(value)
    } else if (typeof value === 'object') handleDates(value)
  }

  return
}

const getApiHeaders = (
  args: {
    accessToken: string
  },
  headers?: AxiosRequestHeaders
) => {
  return {
    ...headers,
    Authorization: `Bearer ${args.accessToken}`
  }
}

const api = axios.create()

api.interceptors.response.use((originalResponse) => {
  handleDates(originalResponse.data)
  return originalResponse
})

type Auth = {
  canvasAccessToken: string
  canvasDomain: string
}

export const getCourses = async (args: Auth): Promise<Course[]> => {
  return (
    await api.get(`${args.canvasDomain}/api/v1/courses?exclude_blueprint_courses&per_page=1000`, {
      headers: getApiHeaders({ accessToken: args.canvasAccessToken })
    })
  ).data
}

export const getAssignments = async (
  args: {
    courseId: number
  } & Auth
): Promise<{
  courseId: number
  assignments: Assignment[]
}> => {
  return {
    courseId: args.courseId,
    assignments: (
      await api.get(
        `${args.canvasDomain}/api/v1/courses/${args.courseId}/assignments?per_page=1000`,
        {
          headers: getApiHeaders({ accessToken: args.canvasAccessToken })
        }
      )
    ).data
  }
}

export const getSubmissions = async (
  args: {
    courseId: number
    assignmentId: number
  } & Auth
): Promise<Submission[]> => {
  return (
    await api.get(
      `${args.canvasDomain}/api/v1/courses/${args.courseId}/assignments/${args.assignmentId}/submissions?include[]=rubric_assessment&include[]=submission_comments&per_page=1000`,
      { headers: getApiHeaders({ accessToken: args.canvasAccessToken }) }
    )
  ).data
}

// Hooks
export const useGetSubmissions = () => {
  const { canvasDomain, canvasAccessToken } = useSettingsStore()
  const { assignments } = useGenerationStore()
  return useQueries({
    queries: assignments.map((courseAssignmentId) => {
      const { courseId, assignmentId } = parseHierarchyId(courseAssignmentId)
      return {
        queryKey: ['submissions', courseId, assignmentId],
        queryFn: () => getSubmissions({ canvasAccessToken, canvasDomain, courseId, assignmentId })
      }
    })
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
            courseId
          })
      }
    })
  })
}

export const useGetCourses = () => {
  const { canvasDomain, canvasAccessToken } = useSettingsStore()
  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const courses = await getCourses({
        canvasAccessToken,
        canvasDomain
      })
      return courses
    }
  })
}
