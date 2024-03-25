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
import { generateAssignment, generateQuiz } from './generators'
import * as markdown from './markdown'

export {
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
    generateQuiz,
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
}
