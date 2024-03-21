import { parseISO } from 'date-fns'
import { Assignment } from './types/canvas_api/assignment'
import { Course } from './types/canvas_api/course'
import { Submission } from './types/canvas_api/submission'
import { Quiz } from './types/canvas_api/quiz'
import { QuizSubmission } from './types/canvas_api/quiz-submissions'

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

export type GetQuizRequest = {
    courseId: number
    quizId?: number
}

export const getQuiz = async (args: GetQuizRequest & Auth) => {
    const { canvasAccessToken, canvasDomain } = args
    return await fetch(
        `${canvasDomain}/api/v1/courses/${args.courseId}/quizzes/${args?.quizId}`,
        { headers: getApiHeaders({ accessToken: canvasAccessToken }) }
    )
        .then(intercept)
        .then(toJSON<Quiz>)
}

export type GetQuizSubmissionRequest = {
    courseId: number
    quizId: number
    submissionId: number
}

export const getQuizSubmission = async (
    args: GetQuizSubmissionRequest & Auth
) => {
    const { canvasAccessToken, canvasDomain } = args
    const results = await fetch(
        `${canvasDomain}/api/v1/courses/${args.courseId}/quizzes/${args.quizId}/submissions`,
        { headers: getApiHeaders({ accessToken: canvasAccessToken }) }
    )
        .then(intercept)
        .then(toJSON<{ quiz_submissions: QuizSubmission[] }>)
        .then((data) => data.quiz_submissions)
    return results.find((sub) => sub.submission_id == args.submissionId)
}

export const getQuizQuestions = async (args: GetQuizQuestionRequest & Auth) => {
    const { canvasAccessToken, canvasDomain } = args
    const results = await fetch(
        `${canvasDomain}/api/v1/quiz_submissions/${args.quizSubmissionId}/questions`,
        { headers: getApiHeaders({ accessToken: canvasAccessToken }) }
    )
        .then(intercept)
        .then((resp) => resp.json())
        .then((quiz_resp) => {
            quiz_resp.quiz_submission_questions
        })
    return results
}

export type GetQuizQuestionRequest = {
    quizSubmissionId: number
}

export const getQuizHTML = async (args: GetQuizHTMLRequest & Auth) => {
    const { canvasAccessToken, canvasDomain } = args
    const sessionURL = await fetch(
        `${canvasDomain}/api/v1/login/session_token?return_to=http://sdlstudentvm06.msoe.edu/
        courses/${args.courseId}/quizzes/${args.quizId}/history?quiz_submission_id=${args.quizSubmissionId}`,
        { headers: getApiHeaders({ accessToken: canvasAccessToken }) }
    )
        .then(intercept)
        .then((resp) => resp.json())
        .then((session_resp) => {
            session_resp.session_url
        })
    const quizHTML =
        await fetch(`${canvasDomain}/courses/${args.courseId}/quizzes/${args.quizId}
    /history?quiz_submission_id=${args.quizSubmissionId}&session_token=${sessionURL}
`)
            .then(intercept)
            .then((htmlResp) => htmlResp.text())
    return quizHTML
}

export type GetQuizHTMLRequest = {
    quizId: number
    quizSubmissionId: number
    courseId: number
}

export type CreateCanvasApiConfig =
    | {
          type: 'withAuth'
          accessToken: string
          domain: string
      }
    | {
          type: 'withoutAuth'
      }

export const createCanvasApi = (
    config: CreateCanvasApiConfig = { type: 'withoutAuth' }
) => {
    if (config.type === 'withAuth') {
        return {
            getCourses: () =>
                getCourses({
                    canvasAccessToken: config.accessToken,
                    canvasDomain: config.domain,
                }),
            getAssignments: (args: GetAssignmentsRequest) =>
                getAssignments({
                    canvasAccessToken: config.accessToken,
                    canvasDomain: config.domain,
                    ...args,
                }),
            getAssignmentsWithCourseId: (args: GetAssignmentsRequest) =>
                getAssignmentsWithCourseId({
                    canvasAccessToken: config.accessToken,
                    canvasDomain: config.domain,
                    ...args,
                }),
            getSubmissions: (args: GetSubmissionsRequest) =>
                getSubmissions({
                    canvasAccessToken: config.accessToken,
                    canvasDomain: config.domain,
                    ...args,
                }),
            getQuiz: (args: GetQuizRequest) =>
                getQuiz({
                    canvasAccessToken: config.accessToken,
                    canvasDomain: config.domain,
                    ...args,
                }),
            getQuizSubmission: (args: GetQuizSubmissionRequest) =>
                getQuizSubmission({
                    canvasAccessToken: config.accessToken,
                    canvasDomain: config.domain,
                    ...args,
                }),
        }
    }

    return {
        getCourses,
        getAssignments,
        getAssignmentsWithCourseId,
        getSubmissions,
        getQuiz,
        getQuizSubmission,
    }
}
