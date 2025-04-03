import 'reflect-metadata'
// ./assignment
import { Assignment } from './assignment/Assignment'
import { AssignmentDate } from './assignment/AssignmentDate'
import { AssignmentGroup } from './assignment/AssignmentGroup'
import { ExternalToolTagAttributes } from './assignment/ExternalToolTagAttributes'
import { LockInfo } from './assignment/LockInfo'
import { NeedsGradingCountBySection } from './assignment/NeedsGradingCountBySection'
import { RubricCriteria } from './assignment/RubricCriteria'
import { RubricRating } from './assignment/RubricRating'
import { ScoreStatistic } from './assignment/ScoreStatistic'
import { TurnitinSettings } from './assignment/TurnitinSettings'
// ./course
import { BlueprintRestrictions } from './course/BlueprintRestrictions'
import { Course } from './course/Course'
import { CourseProgress } from './course/CourseProgress'
import { Term } from './course/Term'
// ./discussion-topic
import { DiscussionTopic } from './discussion-topic/DiscussionTopic'
import { GroupTopic } from './discussion-topic/GroupTopic'
// ./enrollment
import { Enrollment } from './enrollment/Enrollment'
import { Grade } from './enrollment/Grade'
// ./file
import { File } from './file/File'
// ./grading-period
import { GradingPeriod } from './grading-period/GradingPeriod'
// ./quiz
import { Quiz } from './quiz/Quiz'
// ./quiz-question
import { Formula } from './quiz-question/Formula'
import { Match } from './quiz-question/Match'
import { QuestionData } from './quiz-question/QuestionData'
import { QuizQuestion } from './quiz-question/QuizQuestion'
import { QuizSubmissionAnswer } from './quiz-question/QuizSubmissionAnswer'
import { Variable } from './quiz-question/Variable'
// ./quiz-submission
import { QuizSubmission } from './quiz-submission/QuizSubmission'
// ./quiz-submission-question
import { Answer } from './quiz-submission-question/Answer'
import { QuizSubmissionQuestion } from './quiz-submission-question/QuizSubmissionQuestion'
// ./submission
import { MediaComment } from './submission/MediaComment'
import { RubricAssessmentCriterion } from './submission/RubricAssessmentCriterion'
import {
    LatePolicyStatus,
    Submission,
    SubmissionType,
    WorkflowState,
} from './submission/Submission'
import { SubmissionAttachment } from './submission/SubmissionAttachment'
import { SubmissionComment } from './submission/SubmissionComment'
// ./user
import { User } from './user/User'
import { UserDisplay } from './user/UserDisplay'

export {
    Answer,
    Assignment,
    AssignmentDate,
    AssignmentGroup,
    BlueprintRestrictions,
    Course,
    CourseProgress,
    DiscussionTopic,
    Enrollment,
    ExternalToolTagAttributes,
    File,
    Formula,
    Grade,
    GradingPeriod,
    GroupTopic,
    LatePolicyStatus,
    LockInfo,
    Match,
    MediaComment,
    NeedsGradingCountBySection,
    QuestionData,
    Quiz,
    QuizQuestion,
    QuizSubmission,
    QuizSubmissionAnswer,
    QuizSubmissionQuestion,
    RubricAssessmentCriterion,
    RubricCriteria,
    RubricRating,
    ScoreStatistic,
    Submission,
    SubmissionAttachment,
    SubmissionComment,
    SubmissionType,
    Term,
    TurnitinSettings,
    User,
    UserDisplay,
    Variable,
    WorkflowState,
}

/**
 * Defines a type matching the read state-related
 * portion of the Canvas API
 */
export type ReadState = 'read' | 'unread'
