/**
 * Exports various methods and types defined in other files
 */
import {
    Auth,
    GetAssignmentsRequest,
    GetSubmissionsRequest,
    GetQuizRequest,
    GetQuizSubmissionRequest,
    CreateCanvasApiConfig,
} from './canvas.api'

import { createCanvasCache } from './canvas.cache'

import {
    generateAssignmentDescription,
    generateAssignmentSubmission,
    generateQuiz,
    generateQuizDescription,
    generateQuizSubmission,
} from './generators'
import * as markdown from './markdown'
import {
    assembleQuizQuestionsAndComments,
    assembleQuizQuestionsAndAnswers,
} from './quiz-organization'
import {
    testCourses,
    testAssignments,
    testSubmissions,
} from './mocks/canvas.api.mocks'

export * from './db/entity/entity.types'

export * from './db/migration/front-end/index'

export * from './generation'

export {
    testCourses,
    testAssignments,
    testSubmissions,
    createCanvasCache as createCanvasApi,
    generateAssignmentDescription,
    generateAssignmentSubmission,
    generateQuiz,
    generateQuizDescription,
    generateQuizSubmission,
    markdown,
    Auth,
    GetAssignmentsRequest,
    GetSubmissionsRequest,
    GetQuizRequest,
    GetQuizSubmissionRequest,
    CreateCanvasApiConfig,
    assembleQuizQuestionsAndComments,
    assembleQuizQuestionsAndAnswers,
}
