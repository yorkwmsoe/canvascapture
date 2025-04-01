/**
 * Defines types matching submission-related
 * portions of the Canvas API
 */
import { Assignment } from './assignment'
import { Course } from './course'
import { ReadState } from './read-state'
import { User, UserDisplay } from './user'
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryColumn,
} from 'typeorm'

@Entity()
export class Submission {
    @PrimaryColumn()
    id: number

    // The submission's assignment id
    @Column()
    assignment_id: number

    // The submission's assignment (see the assignments API) (optional)
    @Column()
    assignment?: Assignment

    // The submission's course (see the course API) (optional)
    @Column()
    course?: Course

    // This is the submission attempt number.
    @Column()
    attempt: number

    // The content of the submission, if it was submitted directly in a text field.
    @Column()
    body: string

    // The grade for the submission, translated into the assignment grading scheme
    // (so a letter grade, for example).
    @Column()
    grade: string

    // A boolean flag which is false if the student has re-submitted since the
    // submission was last graded.
    @Column()
    grade_matches_current_submission: boolean

    // URL to the submission. This will require the user to log in.
    @Column()
    html_url?: string

    // URL to the submission preview. This will require the user to log in.
    @Column()
    preview_url: string

    // The raw score
    @Column()
    score: number

    // Associated comments for a submission (optional)
    @OneToMany(
        () => SubmissionComment,
        (submissionComment) => submissionComment.submission
    )
    @JoinColumn()
    submission_comments?: SubmissionComment[]

    // The types of submission ex:
    // ('online_text_entry'|'online_url'|'online_upload'|'online_quiz'|'media_record
    // ing'|'student_annotation')
    @Column()
    submission_type: SubmissionType

    // The timestamp when the assignment was submitted
    @Column()
    submitted_at: Date

    // The URL of the submission (for 'online_url' submissions).
    @Column()
    url?: string

    // The id of the user who created the submission
    @Column()
    user_id: number

    // The id of the user who graded the submission. This will be null for
    // submissions that haven't been graded yet. It will be a positive number if a
    // real user has graded the submission and a negative number if the submission
    // was graded by a process (e.g. Quiz autograder and autograding LTI tools).
    // Specifically autograded quizzes set grader_id to the negative of the quiz id.
    // Submissions autograded by LTI tools set grader_id to the negative of the tool
    // id.
    @Column()
    grader_id: number

    @Column()
    graded_at: Date

    // The submissions user (see user API) (optional)
    @Column()
    user?: User

    // Whether the submission was made after the applicable due date
    @Column()
    late: boolean

    // Whether the assignment is visible to the user who submitted the assignment.
    // Submissions where `assignment_visible` is false no longer count towards the
    // student's grade and the assignment can no longer be accessed by the student.
    // `assignment_visible` becomes false for submissions that do not have a grade
    // and whose assignment is no longer assigned to the student's section.
    @Column()
    assignment_visible?: boolean

    // Whether the assignment is excused.  Excused assignments have no impact on a
    // user's grade.
    @Column()
    excused: boolean

    // Whether the assignment is missing.
    @Column()
    missing: boolean

    // The status of the submission in relation to the late policy. Can be late,
    // missing, extended, none, or null.
    @Column()
    late_policy_status?: LatePolicyStatus

    // The amount of points automatically deducted from the score by the
    // missing/late policy for a late or missing assignment.
    @Column()
    points_deducted?: number

    // The amount of time, in seconds, that an submission is late by.
    @Column()
    seconds_late: number

    // The current state of the submission
    @Column()
    workflow_state: WorkflowState

    // Extra submission attempts allowed for the given user and assignment.
    @Column()
    extra_attempts?: number

    // A unique short ID identifying this submission without reference to the owning
    // user. Only included if the caller has administrator access for the current
    // account.
    @Column()
    anonymous_id: string

    // The date this submission was posted to the student, or nil if it has not been
    // posted.
    @Column()
    posted_at: Date

    // The read status of this submission for the given user (optional). Including
    // read_status will mark submission(s) as read.
    @Column()
    read_status?: ReadState

    // This indicates whether the submission has been reassigned by the instructor.
    @Column()
    redo_request: boolean

    @Column()
    entered_grade: string

    @Column()
    entered_score: number

    @Column()
    rubric_assessment?: RubricAssessment

    @OneToMany(
        () => SubmissionAttachment,
        (submissionAttachment) => submissionAttachment.submission
    )
    @JoinColumn()
    attachments?: SubmissionAttachment[]

    @OneToOne(() => MediaComment, (mediaComment) => mediaComment.submission)
    @Column()
    media_comment?: MediaComment
}

@Entity()
export class SubmissionAttachment {
    @PrimaryColumn()
    id: number

    @Column()
    uuid: string

    @Column()
    folder_id: number

    @Column()
    display_name: string

    @Column()
    filename: string

    @Column()
    upload_status: string

    @Column()
    'content-type': string

    @Column()
    url: string

    @Column()
    size: number

    @Column()
    created_at: Date

    @Column()
    updated_at: Date

    @Column()
    unlock_at: null

    @Column()
    locked: boolean

    @Column()
    hidden: boolean

    @Column()
    lock_at: null

    @Column()
    hidden_for_user: boolean

    @Column()
    thumbnail_url: string

    @Column()
    modified_at: Date

    @Column()
    mime_class: string

    @Column()
    media_entry_id: null

    @Column()
    category: string

    @Column()
    locked_for_user: boolean

    @Column()
    preview_url: null

    @ManyToOne(() => Submission, (submission) => submission.attachments)
    @JoinColumn()
    submission: Submission
}

@Entity()
export class SubmissionComment {
    @PrimaryColumn()
    id: number

    @Column()
    author_id: number

    @Column()
    author_name: string

    // Abbreviated user object UserDisplay (see users API).
    @Column()
    author: UserDisplay

    @Column()
    comment: string

    @Column()
    created_at: Date

    @Column()
    edited_at: Date

    @Column()
    media_comment: MediaComment

    @ManyToOne(() => Submission, (submission) => submission.submission_comments)
    @JoinColumn()
    submission: Submission
}

export class MediaComment {
    @Column()
    'content-type': string

    @Column()
    display_name?: string

    @Column()
    media_id: string

    @Column()
    media_type: string

    @Column()
    url: string

    @OneToOne(() => Submission, (submission) => submission.media_comment)
    @JoinColumn()
    submission: Submission
}

export type RubricAssessment = Record<string, RubricAssessmentCriterion>

@Entity()
export class RubricAssessmentCriterion {
    @Column()
    points: number

    @Column()
    comments: string

    @Column()
    rating_id: string
}

export type WorkflowState =
    | 'submitted'
    | 'unsubmitted'
    | 'graded'
    | 'pending_review'

export type LatePolicyStatus = 'missing' | 'late' | 'none' | 'extended' | null

export type SubmissionType =
    | 'online_text_entry'
    | 'online_url'
    | 'online_upload'
    | 'online_quiz'
    | 'media_recording'
    | 'student_annotation'
