import { parseISO } from 'date-fns'
import { Assignment } from './types/canvas_api/assignment.js'
import { Course } from './types/canvas_api/course.js'
import { Submission } from './types/canvas_api/submission.js'

export type Auth = {
    canvasAccessToken: string
    canvasDomain: string
}

function toJSON<T>(response: Response): Promise<T> {
    return response.json()
}

// date handling from: https://stackoverflow.com/a/66238542
function handleDates(body: unknown) {
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

async function intercept(response: Response) {
    handleDates(response)
    return response
}

const getApiHeaders = (
    args: {
        accessToken: string
    },
    headers?: HeadersInit
) => {
    return {
        ...headers,
        Authorization: `Bearer ${args.accessToken}`,
    }
}

const getCourses = async (args: Auth) => {
    const { canvasAccessToken, canvasDomain } = args
    return await fetch(
        `${canvasDomain}/api/v1/courses?exclude_blueprint_courses&per_page=1000`,
        {
            headers: getApiHeaders({ accessToken: canvasAccessToken }),
        }
    )
        .then(intercept)
        .then(toJSON<Course[]>)
}

export type GetAssignmentsRequest = {
    courseId: number
}

const getAssignments = async (args: GetAssignmentsRequest & Auth) => {
    const { canvasAccessToken, canvasDomain } = args
    return await fetch(
        `${canvasDomain}/api/v1/courses/${args.courseId}/assignments?per_page=1000`,
        {
            headers: getApiHeaders({
                accessToken: canvasAccessToken,
            }),
        }
    )
        .then(intercept)
        .then(toJSON<Assignment[]>)
}

const getAssignmentsWithCourseId = async (
    args: GetAssignmentsRequest & Auth
) => {
    const { canvasAccessToken, canvasDomain } = args
    return {
        courseId: args.courseId,
        assignments: await getAssignments({
            canvasAccessToken: canvasAccessToken,
            canvasDomain: canvasDomain,
            courseId: args.courseId,
        }),
    }
}

export type GetSubmissionsRequest = {
    courseId: number
    assignmentId: number
}

export const getSubmissions = async (args: GetSubmissionsRequest & Auth) => {
    const { canvasAccessToken, canvasDomain } = args
    return await fetch(
        `${canvasDomain}/api/v1/courses/${args.courseId}/assignments/${args.assignmentId}/submissions?include[]=rubric_assessment&include[]=submission_comments&per_page=1000`,
        { headers: getApiHeaders({ accessToken: canvasAccessToken }) }
    )
        .then(intercept)
        .then(toJSON<Submission[]>)
}

export const createCanvasApi = () => {
    return {
        getCourses,
        getAssignments,
        getAssignmentsWithCourseId,
        getSubmissions,
    }
}
