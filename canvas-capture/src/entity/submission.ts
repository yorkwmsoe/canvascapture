/**
 * Defines types matching submission-related
 * portions of the Canvas API
 */
import 'reflect-metadata'
import type { Assignment, RubricCriteria } from './assignment'
import type { Course } from './course'
import type { ReadState } from './read-state'
import type { User, UserDisplay } from './user'
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm'
import CanvasEntity from './canvas-entity'

@Entity()
export class Submission extends CanvasEntity {
    @PrimaryColumn({ type: 'numeric' })
    id: number

    // The submission's assignment id
    @Column({ type: 'numeric' })
    assignment_id: number

    // The submission's assignment (see the assignments API) (optional)
    @OneToOne('Assignment', (assignment: Assignment) => assignment.submission)
    @JoinColumn()
    assignment?: Assignment

    // The submission's course (see the course API) (optional)
    @ManyToOne('Course', (course: Course) => course.submissions)
    @JoinColumn()
    course?: Course

    // This is the submission attempt number.
    @Column({ type: 'numeric' })
    attempt: number

    // The content of the submission, if it was submitted directly in a text field.
    @Column({ type: 'text' })
    body: string

    // The grade for the submission, translated into the assignment grading scheme
    // (so a letter grade, for example).
    @Column({ type: 'text' })
    grade: string

    // A boolean flag which is false if the student has re-submitted since the
    // submission was last graded.
    @Column({ type: 'boolean' })
    grade_matches_current_submission: boolean

    // URL to the submission. This will require the user to log in.
    @Column({ nullable: true, type: 'text' })
    html_url?: string

    // URL to the submission preview. This will require the user to log in.
    @Column({ type: 'text' })
    preview_url: string

    // The raw score
    @Column({ type: 'numeric' })
    score: number

    @Column({ nullable: true, type: 'simple-array' })
    submission_commentsIds: number[]

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
    @Column({ type: 'text' })
    submission_type: SubmissionType

    // The timestamp when the assignment was submitted
    @Column({ type: 'date' })
    submitted_at: Date

    // The URL of the submission (for 'online_url' submissions).
    @Column({ nullable: true, type: 'text' })
    url?: string

    // The id of the user who created the submission
    @Column({ type: 'numeric' })
    user_id: number

    // The id of the user who graded the submission. This will be null for
    // submissions that haven't been graded yet. It will be a positive number if a
    // real user has graded the submission and a negative number if the submission
    // was graded by a process (e.g. Quiz autograder and autograding LTI tools).
    // Specifically autograded quizzes set grader_id to the negative of the quiz id.
    // Submissions autograded by LTI tools set grader_id to the negative of the tool
    // id.
    @Column({ type: 'numeric' })
    grader_id: number

    @Column({ type: 'date' })
    graded_at: Date

    @Column({ nullable: true, type: 'numeric' })
    userId: number

    // The submissions user (see user API) (optional)
    @OneToOne('User')
    @JoinColumn()
    user?: User

    // Whether the submission was made after the applicable due date
    @Column({ type: 'boolean' })
    late: boolean

    // Whether the assignment is visible to the user who submitted the assignment.
    // Submissions where `assignment_visible` is false no longer count towards the
    // student's grade and the assignment can no longer be accessed by the student.
    // `assignment_visible` becomes false for submissions that do not have a grade
    // and whose assignment is no longer assigned to the student's section.
    @Column({ nullable: true, type: 'boolean' })
    assignment_visible?: boolean

    // Whether the assignment is excused.  Excused assignments have no impact on a
    // user's grade.
    @Column({ type: 'boolean' })
    excused: boolean

    // Whether the assignment is missing.
    @Column({ type: 'boolean' })
    missing: boolean

    // The status of the submission in relation to the late policy. Can be late,
    // missing, extended, none, or null.
    @Column({ nullable: true, type: 'text' })
    late_policy_status?: LatePolicyStatus

    // The amount of points automatically deducted from the score by the
    // missing/late policy for a late or missing assignment.
    @Column({ nullable: true, type: 'numeric' })
    points_deducted?: number

    // The amount of time, in seconds, that a submission is late by.
    @Column({ type: 'numeric' })
    seconds_late: number

    // The current state of the submission
    @Column({ type: 'text' })
    workflow_state: WorkflowState

    // Extra submission attempts allowed for the given user and assignment.
    @Column({ nullable: true, type: 'numeric' })
    extra_attempts?: number

    // A unique short ID identifying this submission without reference to the owning
    // user. Only included if the caller has administrator access for the current
    // account.
    @Column({ type: 'text' })
    anonymous_id: string

    // The date this submission was posted to the student, or nil if it has not been
    // posted.
    @Column({ type: 'date' })
    posted_at: Date

    // The read status of this submission for the given user (optional). Including
    // read_status will mark submission(s) as read.
    @Column({ nullable: true, type: 'text' })
    read_status?: ReadState

    // This indicates whether the submission has been reassigned by the instructor.
    @Column({ type: 'boolean' })
    redo_request: boolean

    @Column({ type: 'text' })
    entered_grade: string

    @Column({ type: 'numeric' })
    entered_score: number

    @OneToMany(
        'RubricAssessmentCriterion',
        (rubricAssessmentCriterion: RubricAssessmentCriterion) =>
            rubricAssessmentCriterion.submission
    )
    @JoinColumn()
    rubric_assessment?: RubricAssessmentCriterion[]

    @OneToMany(
        () => SubmissionAttachment,
        (submissionAttachment) => submissionAttachment.submission
    )
    @JoinColumn()
    attachments?: SubmissionAttachment[]

    @Column({ nullable: true, type: 'numeric' })
    media_commentId: number

    @OneToOne(() => MediaComment, (mediaComment) => mediaComment.submission)
    @JoinColumn()
    media_comment?: MediaComment

    @UpdateDateColumn()
    date_last_received_from_canvas: Date

    constructor(data: Partial<Submission>) {
        super()
        Object.assign(this, data)
    }
}

@Entity()
export class SubmissionAttachment extends CanvasEntity {
    @PrimaryColumn({ type: 'numeric' })
    id: number

    @Column({ type: 'numeric' })
    uuid: string

    @Column({ type: 'numeric' })
    folder_id: number

    @Column({ type: 'text' })
    display_name: string

    @Column({ type: 'text' })
    filename: string

    @Column({ type: 'text' })
    upload_status: string

    @Column({ type: 'text' })
    'content-type': string

    @Column({ type: 'text' })
    url: string

    @Column({ type: 'numeric' })
    size: number

    @Column({ type: 'date' })
    created_at: Date

    @Column({ type: 'date' })
    updated_at: Date

    unlock_at: null

    @Column({ type: 'boolean' })
    locked: boolean

    @Column({ type: 'boolean' })
    hidden: boolean

    lock_at: null

    @Column({ type: 'boolean' })
    hidden_for_user: boolean

    @Column({ type: 'text' })
    thumbnail_url: string

    @Column({ type: 'date' })
    modified_at: Date

    @Column({ type: 'string' })
    mime_class: string

    media_entry_id: null

    @Column({ type: 'text' })
    category: string

    @Column({ type: 'boolean' })
    locked_for_user: boolean

    preview_url: null

    @ManyToOne(() => Submission, (submission) => submission.attachments)
    @JoinColumn()
    submission: Submission

    @UpdateDateColumn()
    date_last_received_from_canvas: Date
}

@Entity()
export class SubmissionComment extends CanvasEntity {
    @PrimaryColumn({ type: 'numeric' })
    id: number

    @Column({ type: 'numeric' })
    author_id: number

    @Column({ type: 'text' })
    author_name: string

    // Abbreviated user object UserDisplay (see users API).
    @OneToOne('UserDisplay')
    @JoinColumn()
    author: UserDisplay

    @Column({ type: 'text' })
    comment: string

    @Column({ type: 'date' })
    created_at: Date

    @Column({ type: 'date' })
    edited_at: Date

    @OneToOne('MediaComment')
    @JoinColumn()
    media_comment: MediaComment

    @ManyToOne(
        'Submission',
        (submission: Submission) => submission.submission_comments
    )
    @JoinColumn()
    submission: Submission

    @UpdateDateColumn({ type: 'date' })
    date_last_received_from_canvas: Date
}

@Entity()
export class MediaComment extends CanvasEntity {
    @Column({ type: 'text' })
    'content-type': string

    @Column({ type: 'text' })
    display_name?: string

    @Column({ type: 'text' })
    media_id: string

    @Column({ type: 'text' })
    media_type: string

    @Column({ type: 'text' })
    url: string

    @OneToOne(
        'Submission',
        (submission: Submission) => submission.media_comment
    )
    @JoinColumn()
    submission: Submission

    @UpdateDateColumn({ type: 'date' })
    date_last_received_from_canvas: Date
}

@Entity()
export class RubricAssessmentCriterion extends CanvasEntity {
    @PrimaryColumn({ type: 'numeric' })
    id: number

    @ManyToOne(
        'RubricCriteria',
        (rubricCriteria: RubricCriteria) => rubricCriteria.assessments
    )
    @JoinColumn()
    rubricCriteria: RubricCriteria

    @Column({ type: 'numeric' })
    points: number

    @Column({ type: 'text' })
    comments: string

    @Column({ type: 'text' })
    rating_id: string

    @ManyToOne(
        'Submission',
        (submission: Submission) => submission.rubric_assessment
    )
    @JoinColumn()
    submission: Submission

    @UpdateDateColumn({ type: 'date' })
    date_last_received_from_canvas: Date
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
