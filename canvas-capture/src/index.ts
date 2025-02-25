/**
 * Exports various methods and types defined in other files
 */
import {
    createCanvasApi,
    Auth,
    GetAssignmentsRequest,
    GetSubmissionsRequest,
    GetQuizRequest,
    GetQuizSubmissionRequest,
    CreateCanvasApiConfig,
} from './canvas.api'
import { Assignment } from './types/canvas_api/assignment'
import { Course } from './types/canvas_api/course'
import { DiscussionTopic } from './types/canvas_api/discussion-topic'
import { Enrollment } from './types/canvas_api/enrollment'
import { File } from './types/canvas_api/file'
import { GradingPeriod } from './types/canvas_api/grading-period'
import { ReadState } from './types/canvas_api/read-state'
import {
    Submission,
    SubmissionComment,
    MediaComment,
    RubricAssessment,
    RubricAssessmentCriterion,
    WorkflowState,
    LatePolicyStatus,
    SubmissionType,
} from './types/canvas_api/submission'
import { User } from './types/canvas_api/user'
import { Quiz } from './types/canvas_api/quiz'
import { QuizSubmission } from './types/canvas_api/quiz-submissions'
import {
    generateAssignment,
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

export * from './generation'

export {
    testCourses,
    testAssignments,
    testSubmissions,
    createCanvasApi,
    Assignment,
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
    generateAssignment,
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
    RubricAssessment,
    RubricAssessmentCriterion,
    WorkflowState,
    LatePolicyStatus,
    SubmissionType,
    assembleQuizQuestionsAndComments,
    assembleQuizQuestionsAndAnswers,
}
