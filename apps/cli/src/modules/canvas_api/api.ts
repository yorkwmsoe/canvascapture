import axios, { AxiosRequestHeaders } from 'axios'
import { Assignment } from './types/assignment'
import { Course } from './types/course'
import { Submission } from './types/submission'
import { Quiz } from './types/quiz'
import { QuizSubmission } from './types/quiz-submissions'
import { parseISO } from 'date-fns'
import { getCanvasApiBaseUrl, getCanvasApiToken } from '@/env'

// date handling from: https://stackoverflow.com/a/66238542
export function handleDates(body: any) {
    if (body === null || body === undefined || typeof body !== 'object') return body

    for (const key of Object.keys(body)) {
        const value = body[key]
        if (value && typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(value)) {
            body[key] = parseISO(value)
        } else if (typeof value === 'object') handleDates(value)
    }
}

const getApiHeaders = (headers?: AxiosRequestHeaders) => {
    return {
        ...headers,
        Authorization: `Bearer ${getCanvasApiToken()}`,
    }
}

const api = axios.create()

api.interceptors.response.use((originalResponse) => {
    handleDates(originalResponse.data)
    return originalResponse
})

export const getCourses = async (): Promise<Course[]> => {
    return (await api.get(`${getCanvasApiBaseUrl()}/courses?exclude_blueprint_courses&per_page=1000`, { headers: getApiHeaders() })).data
}

export const getAssignments = async (course_id: number): Promise<Assignment[]> => {
    return (await api.get(`${getCanvasApiBaseUrl()}/courses/${course_id}/assignments?per_page=1000`, { headers: getApiHeaders() })).data
}

export const getSubmissions = async (course_id: number, assignment_id: number): Promise<Submission[]> => {
    return (await api.get(`${getCanvasApiBaseUrl()}/courses/${course_id}/assignments/${assignment_id}/submissions?include[]=rubric_assessment&include[]=submission_comments&per_page=1000`, { headers: getApiHeaders() })).data
}

export const getMostCommonQuizVersion = async (course_id: number, quiz_id: number): Promise<number> => {
    let quizSubmissions: QuizSubmission[] = []
    const results = (await api.get(`${getCanvasApiBaseUrl()}/courses/${course_id}/quizzes/${quiz_id}/submissions`, { headers: getApiHeaders() })).data
    for (const res of results.quiz_submissions) {
        quizSubmissions.push(res)
    }
    const versionNumberOccurrences = new Map<number, number>()
    quizSubmissions.forEach((quiz) => {
        if (!versionNumberOccurrences.has(quiz.quiz_version)) {
            versionNumberOccurrences.set(quiz.quiz_version, 1)
        } else {
            let count = versionNumberOccurrences.get(quiz.quiz_version)
            // @ts-ignore
            versionNumberOccurrences.set(quiz.quiz_version, count + 1)
        }
    })
    let largestVal = -1
    let largestKey = -1
    versionNumberOccurrences.forEach((key, value) => {
        if (value > largestVal) {
            largestKey = key
            largestVal = value
        } else if (value == largestVal && key > largestVal) {
            largestKey = key
            largestVal = value
        }
    })
    //need a if key == -1 or val ==-1 check
    return largestVal
}

// export const getLatestQuizVersion = async(course_id: number, quiz_id: number): Promise<number> => {
//   let quiz: Quiz = (await api.get(`${getCanvasApiBaseUrl()}/courses/${course_id}/quizzes/${quiz_id}`, { headers: getApiHeaders() })).data;
//   //return (await api.get(`${getCanvasApiBaseUrl()}/courses/${course_id}/quizzes/${quiz_id}`, { headers: getApiHeaders() })).data;
//   return quiz.version_number
// };

export const getQuiz = async (course_id: number, quiz_id?: number): Promise<Quiz> => {
    let quiz: Quiz = (await api.get(`${getCanvasApiBaseUrl()}/courses/${course_id}/quizzes/${quiz_id}`, { headers: getApiHeaders() })).data
    return quiz
}

export const getQuizSubmission = async (course_id: number, quiz_id: number, submission_id: number): Promise<QuizSubmission> => {
    //get all of the submissions for a quiz
    let quizSubmissions: QuizSubmission[] = []
    const results = (await api.get(`${getCanvasApiBaseUrl()}/courses/${course_id}/quizzes/${quiz_id}/submissions`, { headers: getApiHeaders() })).data
    for (const res of results.quiz_submissions) {
        quizSubmissions.push(res)
    }
    let submission: QuizSubmission | undefined = quizSubmissions.find((sub) => sub.submission_id == submission_id)
    if (submission == null) {
        submission = {
            id: -1,
        } as QuizSubmission
    }
    return submission
}
