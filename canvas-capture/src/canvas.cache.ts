import {
    Assignment,
    AssignmentGroup,
    Course,
    Quiz,
    QuizSubmission,
    QuizSubmissionQuestion,
    Submission,
} from './db/entity/entity.types'
import {
    Auth,
    CanvasRequest,
    getAssignmentGroups,
    getAssignments,
    GetAssignmentsRequest,
    getAssignmentsWithCourseId,
    getCourses,
    GetLatestQuizVersionRequest,
    getMostCommonQuizVersion,
    GetMostCommonQuizVersionRequest,
    getQuiz,
    getQuizQuestionsNoParams,
    GetQuizQuestionsNoParamsRequest,
    getQuizQuestionsParams,
    GetQuizQuestionsParamsRequest,
    GetQuizRequest,
    getQuizSubmission,
    getQuizSubmissionQuestions,
    GetQuizSubmissionQuestionsRequest,
    GetQuizSubmissionRequest,
    getSubmissions,
    GetSubmissionsRequest,
} from './canvas.api'
import { LessThan } from 'typeorm'
import CanvasEntity from './db/entity/canvas-entity'

const yesterday = (): Date => {
    const date = new Date()
    date.setDate(date.getDate() - 1)
    return date
}

const getCachedArray = async (
    entity: typeof CanvasEntity,
    // eslint-disable-next-line @typescript-eslint/ban-types
    apiFunction: Function,
    args?: (CanvasRequest & Auth) | Auth
): Promise<CanvasEntity[]> => {
    const cachedArray = await entity.find({
        where: {
            date_last_received_from_canvas: LessThan(yesterday()),
        },
    })
    if (cachedArray.length > 0) {
        const newData: CanvasEntity[] = (await apiFunction.call(
            args
        )) as CanvasEntity[]
        await entity.upsert(newData, ['id'])
        return newData
    } else {
        return entity.find()
    }
}

//Array
export function getCachedCourses(args: Auth): Promise<Course[]> {
    return getCachedArray(Course, getCourses, args) as Promise<Course[]>
}

//Array
export function getCachedAssignments(
    args: GetAssignmentsRequest & Auth
): Promise<Assignment[]> {
    return getCachedArray(Assignment, getAssignments, args) as Promise<
        Assignment[]
    >
}

//Array
export function getCachedAssignmentsWithCourseId(
    args: GetAssignmentsRequest & Auth
): Promise<Assignment[]> {
    return getCachedArray(
        Assignment,
        getAssignmentsWithCourseId,
        args
    ) as Promise<Assignment[]>
}

//Array
export function getCachedSubmissions(
    args: GetSubmissionsRequest & Auth
): Promise<Submission[]> {
    return getCachedArray(Submission, getSubmissions, args) as Promise<
        Submission[]
    >
}

//Array
export function getCachedAssignmentGroups(
    args: GetAssignmentsRequest & Auth
): Promise<AssignmentGroup[]> {
    return getCachedArray(
        AssignmentGroup,
        getAssignmentGroups,
        args
    ) as Promise<AssignmentGroup[]>
}

//Single
export function getCachedQuiz(args: GetQuizRequest & Auth): Promise<Quiz> {
    if (args.quizId) {
        Quiz.findBy({ id: args.quizId }).then(async (quizzes) => {
            if (quizzes[0].date_last_received_from_canvas < yesterday()) {
                const quiz = await getQuiz(args)
                await Quiz.upsert(quiz, ['id'])
                return getQuiz(args)
            } else {
                return quizzes[0]
            }
        })
    }
    return getQuiz(args)
}

//Single
export async function getCachedQuizSubmission(
    args: GetQuizSubmissionRequest & Auth
): Promise<QuizSubmission | undefined> {
    const quiz = await getCachedQuiz(args)
    let submission
    if (quiz) {
        submission = quiz.quiz_submissions.find((submission) => {
            return submission.id === args.submissionId
        })
        if (
            submission &&
            submission.date_last_received_from_canvas < yesterday()
        ) {
            submission = await getQuizSubmission(args)
            if (submission) {
                await QuizSubmission.upsert(submission, ['id'])
            }
            return submission
        }
    }
    if (submission) {
        return submission
    } else {
        submission = await getQuizSubmission(args)
        if (submission) {
            await QuizSubmission.upsert(submission, ['id'])
        }
        return submission
    }
}

//Array
export function getCachedQuizQuestionParams(
    args: GetQuizQuestionsParamsRequest & Auth
): Promise<QuizSubmissionQuestion[]> {
    return getCachedArray(
        QuizSubmissionQuestion,
        getQuizQuestionsParams,
        args
    ) as Promise<QuizSubmissionQuestion[]>
}

//Array
export function getCachedQuizQuestionNoParams(
    args: GetQuizQuestionsNoParamsRequest & Auth
): Promise<QuizSubmissionQuestion[]> {
    return getCachedArray(
        QuizSubmissionQuestion,
        getQuizQuestionsNoParams,
        args
    ) as Promise<QuizSubmissionQuestion[]>
}

//Array
export function getCachedQuizSubmissionQuestions(
    args: GetQuizSubmissionQuestionsRequest & Auth
): Promise<QuizSubmissionQuestion[]> {
    return getCachedArray(
        QuizSubmissionQuestion,
        getQuizSubmissionQuestions,
        args
    ) as Promise<QuizSubmissionQuestion[]>
}

//Computed
export async function getCachedMostCommonQuizVersion(
    args: GetMostCommonQuizVersionRequest & Auth
): Promise<number> {
    const quiz = await getCachedQuiz(args)
    if (quiz && quiz.date_last_received_from_canvas < yesterday()) {
        let most: number = -1
        let most_version: number = -1
        const counts = new Map<number, number>()
        quiz.quiz_submissions.map((submission) => {
            const count = counts.get(submission.quiz_version)
            if (count) {
                counts.set(submission.quiz_version, count + 1)
                if (count > most) {
                    most = count
                    most_version = submission.quiz_version
                }
            } else {
                counts.set(submission.quiz_version, 1)
            }
        })
        return most_version
    } else {
        return getMostCommonQuizVersion(args)
    }
}

//Computed
export async function getCachedLatestQuizVersion(
    args: GetLatestQuizVersionRequest & Auth
): Promise<number> {
    const quiz = await getCachedQuiz(args)
    return quiz.version_number
}

export type CreateCanvasCacheConfig =
    | {
          type: 'withAuth'
          accessToken: string
          domain: string
          isStudent: boolean
      }
    | {
          type: 'withoutAuth'
      }

export const createCanvasCache = (
    config: CreateCanvasCacheConfig = { type: 'withoutAuth' }
) => {
    if (config.type === 'withAuth') {
        return {
            getCourses: () =>
                getCachedCourses({
                    canvasAccessToken: config.accessToken,
                    canvasDomain: config.domain,
                }),
            getAssignments: (args: GetAssignmentsRequest) =>
                getCachedAssignments({
                    canvasAccessToken: config.accessToken,
                    canvasDomain: config.domain,
                    ...args,
                }),
            getAssignmentsWithCourseId: (args: GetAssignmentsRequest) =>
                getCachedAssignmentsWithCourseId({
                    canvasAccessToken: config.accessToken,
                    canvasDomain: config.domain,
                    ...args,
                }),
            getSubmissions: (args: GetSubmissionsRequest) =>
                getCachedSubmissions({
                    canvasAccessToken: config.accessToken,
                    canvasDomain: config.domain,
                    ...args,
                }),
            getQuiz: (args: GetQuizRequest) =>
                getCachedQuiz({
                    canvasAccessToken: config.accessToken,
                    canvasDomain: config.domain,
                    ...args,
                }),
            getQuizSubmission: (args: GetQuizSubmissionRequest) =>
                getCachedQuizSubmission({
                    canvasAccessToken: config.accessToken,
                    canvasDomain: config.domain,
                    ...args,
                }),
            getQuizQuestionParams: (args: GetQuizQuestionsParamsRequest) =>
                getCachedQuizQuestionParams({
                    canvasAccessToken: config.accessToken,
                    canvasDomain: config.domain,
                    ...args,
                }),
            getQuizQuestionNoParams: (args: GetQuizQuestionsNoParamsRequest) =>
                getCachedQuizQuestionNoParams({
                    canvasAccessToken: config.accessToken,
                    canvasDomain: config.domain,
                    ...args,
                }),
            getQuizSubmissionQuestions: (
                args: GetQuizSubmissionQuestionsRequest
            ) =>
                getCachedQuizSubmissionQuestions({
                    canvasAccessToken: config.accessToken,
                    canvasDomain: config.domain,
                    ...args,
                }),
            getMostCommonQuizVersion: (args: GetMostCommonQuizVersionRequest) =>
                getCachedMostCommonQuizVersion({
                    canvasAccessToken: config.accessToken,
                    canvasDomain: config.domain,
                    ...args,
                }),
            getLatestQuizVersion: (args: GetLatestQuizVersionRequest) =>
                getCachedLatestQuizVersion({
                    canvasAccessToken: config.accessToken,
                    canvasDomain: config.domain,
                    ...args,
                }),
            getAssignmentGroups: (args: GetAssignmentsRequest) =>
                getAssignmentGroups({
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
        getAssignmentGroups,
    }
}
