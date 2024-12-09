import { parseISO } from 'date-fns'
import { Assignment } from './types/canvas_api/assignment'
import { Course } from './types/canvas_api/course'
import { Submission } from './types/canvas_api/submission'
import { Quiz } from './types/canvas_api/quiz'
import { QuizSubmission } from './types/canvas_api/quiz-submissions'
import { QuizSubmissionQuestion } from './types/canvas_api/quiz-submission-question'
import { QuizQuestion } from './types/canvas_api/quiz-question'

export type Auth = {
    canvasAccessToken: string
    canvasDomain: string
}

export function toJSON<T>(response: Response): Promise<T> {
    return response.json()
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

export async function intercept(response: Response) {
    handleDates(response)
    return response
}

export const getApiHeaders = (
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

export const getCourses = async (args: Auth) => {
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

export const getAssignments = async (args: GetAssignmentsRequest & Auth) => {
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

export const getAssignmentsWithCourseId = async (
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
    isStudent: boolean
}

export const getSubmissions = async (args: GetSubmissionsRequest & Auth) => {
    const { canvasAccessToken, canvasDomain, isStudent } = args
    if (isStudent) {
        return await fetch(
            `${canvasDomain}/api/v1/courses/${args.courseId}/assignments/${args.assignmentId}/submissions/self?include[]=rubric_assessment&include[]=submission_comments&per_page=1000`,

            { headers: getApiHeaders({ accessToken: canvasAccessToken }) }
        )
            .then(intercept)
            .then(toJSON<Submission>)
            .then((a) => {
                return [a]
            })
    }
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

export type GetLatestQuizVersionRequest = {
    courseId: number
    quizId: number
}
export const getLatestQuizVersion = async (
    args: GetLatestQuizVersionRequest & Auth
): Promise<number> => {
    const { canvasAccessToken, canvasDomain } = args

    const quiz = await fetch(
        `${canvasDomain}/api/v1/courses/${args.courseId}/quizzes/${args.quizId}`,
        { headers: getApiHeaders({ accessToken: canvasAccessToken }) }
    )
        .then(intercept)
        .then(toJSON<Quiz>)
    return quiz.version_number
}

export type GetMostCommonQuizVersionRequest = {
    courseId: number
    quizId: number
}

export const getMostCommonQuizVersion = async (
    args: GetMostCommonQuizVersionRequest & Auth
): Promise<number> => {
    const { canvasAccessToken, canvasDomain } = args
    const quizSubmissions: QuizSubmission[] = await fetch(
        `${canvasDomain}/api/v1/courses/${args.courseId}/quizzes/${args.quizId}/submissions`,
        { headers: getApiHeaders({ accessToken: canvasAccessToken }) }
    )
        .then(toJSON<{ quiz_submissions: QuizSubmission[] }>)
        .then((data) => data.quiz_submissions)

    if (quizSubmissions != undefined) {
        const versionNumberOccurrences = new Map<number, number>()
        quizSubmissions.forEach((quiz) => {
            if (!versionNumberOccurrences.has(quiz.quiz_version)) {
                versionNumberOccurrences.set(quiz.quiz_version, 1)
            } else {
                const count = versionNumberOccurrences.get(quiz.quiz_version)
                if (count != undefined) {
                    versionNumberOccurrences.set(quiz.quiz_version, count + 1)
                }
            }
        })
        let largestVal = -1
        if (versionNumberOccurrences.size != 0) {
            versionNumberOccurrences.forEach((key, value) => {
                if (value > largestVal) {
                    largestVal = value
                } else if (value == largestVal && key > largestVal) {
                    largestVal = value
                }
            })
        }
        //need a if key == -1 or val ==-1 check
        return largestVal
    }
    return -1
}

export type GetQuizSubmissionQuestionsRequest = {
    quizSubmissionId: number
}

export const getQuizSubmissionQuestions = async (
    args: GetQuizSubmissionQuestionsRequest & Auth
): Promise<QuizSubmissionQuestion[]> => {
    const { canvasAccessToken, canvasDomain } = args
    const quizSubmissionQuestionsResponse = await fetch(
        `${canvasDomain}/api/v1/quiz_submissions/${args.quizSubmissionId}/questions?include[]=quiz_question`,
        { headers: getApiHeaders({ accessToken: canvasAccessToken }) }
    ).then((data) => data.json())
    const quizSubmissionQuestions: QuizSubmissionQuestion[] =
        quizSubmissionQuestionsResponse.quiz_submission_questions
    return quizSubmissionQuestions
}

export type GetQuizQuestionsNoParamsRequest = {
    courseId: number
    quizId: number
}
export const getQuizQuestionsNoParams = async (
    args: GetQuizQuestionsNoParamsRequest & Auth
): Promise<QuizQuestion[]> => {
    const { canvasAccessToken, canvasDomain } = args
    const quizQuestions: QuizQuestion[] = await fetch(
        `${canvasDomain}/api/v1/courses/${args.courseId}/quizzes/${args.quizId}/questions`,
        { headers: getApiHeaders({ accessToken: canvasAccessToken }) }
    )
        .then(intercept)
        .then(toJSON<QuizQuestion[]>)

    return quizQuestions
}

export type GetQuizQuestionsParamsRequest = {
    courseId: number
    quizId: number
    submissionId: number
    quizSubmissionAttempt: number
}

export const getQuizQuestionsParams = async (
    args: GetQuizQuestionsParamsRequest & Auth
): Promise<QuizQuestion[]> => {
    const { canvasAccessToken, canvasDomain } = args
    const quizQuestions: QuizQuestion[] = await fetch(
        `${canvasDomain}/api/v1/courses/${args.courseId}/quizzes/${args.quizId}/questions?quiz_submission_id=${args.submissionId}&quiz_submission_attempt=${args.quizSubmissionAttempt}`,
        { headers: getApiHeaders({ accessToken: canvasAccessToken }) }
    )
        .then(intercept)
        .then(toJSON<QuizQuestion[]>)

    return quizQuestions
}

export type CreateCanvasApiConfig =
    | {
          type: 'withAuth'
          accessToken: string
          domain: string
          isStudent: boolean
      }
    | {
          type: 'withoutAuth'
      }
/**
 * Creates the canvas api, returns the functions used elsewhere in the program
 * These functions are the methods above, the API calls to canvas.
 * If adding an API call, ensure to return it so it can be used elsewhere.
 */
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
            getQuizQuestionsParams: (args: GetQuizQuestionsParamsRequest) =>
                getQuizQuestionsParams({
                    canvasAccessToken: config.accessToken,
                    canvasDomain: config.domain,
                    ...args,
                }),
            getQuizQuestionsNoParams: (args: GetQuizQuestionsNoParamsRequest) =>
                getQuizQuestionsNoParams({
                    canvasAccessToken: config.accessToken,
                    canvasDomain: config.domain,
                    ...args,
                }),
            getQuizSubmissionQuestions: (
                args: GetQuizSubmissionQuestionsRequest
            ) =>
                getQuizSubmissionQuestions({
                    canvasAccessToken: config.accessToken,
                    canvasDomain: config.domain,
                    ...args,
                }),
            getMostCommonQuizVersion: (args: GetMostCommonQuizVersionRequest) =>
                getMostCommonQuizVersion({
                    canvasAccessToken: config.accessToken,
                    canvasDomain: config.domain,
                    ...args,
                }),
            getLatestQuizVersion: (args: GetLatestQuizVersionRequest) =>
                getLatestQuizVersion({
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
