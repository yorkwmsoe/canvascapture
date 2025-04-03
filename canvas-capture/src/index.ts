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
    Assignment,
    AssignmentGroup,
    Course,
    DiscussionTopic,
    Enrollment,
    File,
    GradingPeriod,
    LatePolicyStatus,
    MediaComment,
    Quiz,
    QuizSubmission,
    ReadState,
    RubricAssessmentCriterion,
    Submission,
    SubmissionType,
    SubmissionComment,
    WorkflowState,
    User,
} from './entity/entity.types'
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

//export * from './migration'

export * from './generation'

export { FrontEndDataSource } from '../typeorm.config'

export {
    testCourses,
    testAssignments,
    testSubmissions,
    createCanvasCache as createCanvasApi,
    Assignment,
    AssignmentGroup,
    Course,
    DiscussionTopic,
    Enrollment,
    File,
    GradingPeriod,
    ReadState,
    Submission,
    User,
    Quiz,
    QuizSubmission,
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
    SubmissionComment,
    MediaComment,
    RubricAssessmentCriterion,
    WorkflowState,
    LatePolicyStatus,
    SubmissionType,
    assembleQuizQuestionsAndComments,
    assembleQuizQuestionsAndAnswers,
}
