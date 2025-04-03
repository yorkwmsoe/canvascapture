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

import { Assignment, AssignmentGroup } from './entity/assignment'
import { Course } from './entity/course'
import { DiscussionTopic } from './entity/discussion-topic'
import { Enrollment } from './entity/enrollment'
import { File } from './entity/file'
import { GradingPeriod } from './entity/grading-period'
import { ReadState } from './entity/read-state'
import {
    Submission,
    SubmissionComment,
    MediaComment,
    RubricAssessmentCriterion,
    WorkflowState,
    LatePolicyStatus,
    SubmissionType,
} from './entity/submission'
import { User } from './entity/user'
import { Quiz } from './entity/quiz'
import { QuizSubmission } from './entity/quiz-submissions'
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

export * from './generation'

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
