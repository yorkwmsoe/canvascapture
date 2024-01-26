import { Assignment } from '@renderer/types/canvas_api/assignment'
import { useSettingsStore } from '@renderer/stores/settings.store'
import { useQuery } from '@tanstack/react-query'
import axios, { AxiosRequestHeaders } from 'axios'
import { parseISO } from 'date-fns'
import { Course } from '@renderer/types/canvas_api/course'
import { Submission } from '@renderer/types/canvas_api/submission'

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
  accessToken: string
  canvasApiBaseUrl: string
}

export const getCourses = async (args: Auth): Promise<Course[]> => {
  return (
    await api.get(`${args.canvasApiBaseUrl}/courses?exclude_blueprint_courses&per_page=1000`, {
      headers: getApiHeaders({ accessToken: args.accessToken })
    })
  ).data
}

export const getAssignments = async (
  args: {
    courseId: number
  } & Auth
): Promise<Assignment[]> => {
  return (
    await api.get(`${args.canvasApiBaseUrl}/courses/${args.courseId}/assignments?per_page=1000`, {
      headers: getApiHeaders({ accessToken: args.accessToken })
    })
  ).data
}

export const getSubmissions = async (
  args: {
    courseId: number
    assignmentId: number
  } & Auth
): Promise<Submission[]> => {
  return (
    await api.get(
      `${args.canvasApiBaseUrl}/courses/${args.courseId}/assignments/${args.assignmentId}/submissions?include[]=rubric_assessment&include[]=submission_comments&per_page=1000`,
      { headers: getApiHeaders({ accessToken: args.accessToken }) }
    )
  ).data
}

// Hooks

export const useGetAssignments = ({ courseIds }: { courseIds: number[] }) => {
  const { canvasDomain, accessToken } = useSettingsStore()
  return useQuery({
    queryKey: ['assignments'],
    queryFn: async () => {
      const assignmentPromises = courseIds.map((courseId) =>
        getAssignments({
          accessToken,
          canvasApiBaseUrl: canvasDomain,
          courseId
        })
      )
      return (await Promise.all(assignmentPromises)).flat()
    }
  })
}
