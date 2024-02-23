import axios, { AxiosRequestHeaders } from 'axios'
import { parseISO } from 'date-fns'
import { Assignment } from './types/canvas_api/assignment'
import { Course } from './types/canvas_api/course'
import { Submission } from './types/canvas_api/submission'

export type Auth = {
    canvasAccessToken: string
    canvasDomain: string
}

export type AuthWithApi = Auth & {
    api: ReturnType<typeof axios.create>
}

// date handling from: https://stackoverflow.com/a/66238542
export function handleDates(body: unknown) {
    if (body === null || body === undefined || typeof body !== 'object') return

    for (const key of Object.keys(body)) {
        // @ts-expect-error - we know body is an object
        const value = body[key]
        if (
            value &&
            typeof value === 'string' &&
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(value)
        ) {
            // @ts-expect-error - we know body is an object
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
        Authorization: `Bearer ${args.accessToken}`,
    }
}

const getCourses = async (args: AuthWithApi): Promise<Course[]> => {
    const { api, canvasAccessToken, canvasDomain } = args
    return (
        await api.get(
            `${canvasDomain}/api/v1/courses?exclude_blueprint_courses&per_page=1000`,
            {
                headers: getApiHeaders({ accessToken: canvasAccessToken }),
            }
        )
    ).data
}

export type GetAssignmentsRequest = {
    courseId: number
}

const getAssignments = async (
    args: GetAssignmentsRequest & AuthWithApi
): Promise<{
    courseId: number
    assignments: Assignment[]
}> => {
    const { api, canvasAccessToken, canvasDomain } = args
    return {
        courseId: args.courseId,
        assignments: (
            await api.get(
                `${canvasDomain}/api/v1/courses/${args.courseId}/assignments?per_page=1000`,
                {
                    headers: getApiHeaders({
                        accessToken: canvasAccessToken,
                    }),
                }
            )
        ).data,
    }
}

export type GetSubmissionsRequest = {
    courseId: number
    assignmentId: number
}

export const getSubmissions = async (
    args: GetSubmissionsRequest & AuthWithApi
): Promise<Submission[]> => {
    const { api, canvasAccessToken, canvasDomain } = args
    return (
        await api.get(
            `${canvasDomain}/api/v1/courses/${args.courseId}/assignments/${args.assignmentId}/submissions?include[]=rubric_assessment&include[]=submission_comments&per_page=1000`,
            { headers: getApiHeaders({ accessToken: canvasAccessToken }) }
        )
    ).data
}

export const createCanvasApi = () => {
    const api = axios.create()

    api.interceptors.response.use((originalResponse) => {
        handleDates(originalResponse.data)
        return originalResponse
    })

    return {
        getCourses: async (args: Auth) => {
            return getCourses({ ...args, api })
        },
        getAssignments: async (args: GetAssignmentsRequest & Auth) => {
            return getAssignments({ ...args, api })
        },
        getSubmissions: async (args: GetSubmissionsRequest & Auth) => {
            return getSubmissions({ ...args, api })
        },
    }
}
