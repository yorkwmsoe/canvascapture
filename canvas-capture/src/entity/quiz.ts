/**
 * Defines a type matching the quiz-related
 * portion of the Canvas API
 */
import 'reflect-metadata'
import type { Assignment } from './assignment'
import {
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm'
import { QuizQuestion } from './quiz-question'
import CanvasEntity from './canvas-entity'
import { QuizSubmission } from './quiz-submissions'

@Entity()
export class Quiz extends CanvasEntity {
    // The unique identifier for the quiz.
    @PrimaryColumn()
    id: number

    // The title of the quiz.
    @Column()
    title: string

    // The URL for accessing the quiz in a web browser.
    @Column()
    html_url: string

    // The URL for accessing the quiz in a mobile browser.
    @Column()
    mobile_url: string

    // The description of the quiz.
    @Column()
    description: string

    // The type of the quiz.
    @Column()
    quiz_type: string

    // The time limit for completing the quiz, if any.
    @Column()
    time_limit: number | null

    // Indicates if the timer auto-submit feature is disabled.
    @Column()
    timer_autosubmit_disabled: boolean

    // Indicates if answers are shuffled for the quiz.
    @Column()
    shuffle_answers: boolean

    // Indicates if correct answers are shown after submission.
    @Column()
    show_correct_answers: boolean

    // The scoring policy for the quiz.
    @Column()
    scoring_policy: string

    // The number of attempts allowed for the quiz.
    @Column()
    allowed_attempts: number

    // Indicates if only one question can be answered at a time.
    @Column()
    one_question_at_a_time: boolean

    // The number of questions in the quiz.
    @Column()
    question_count: number

    // The maximum points possible for the quiz.
    @Column()
    points_possible: number

    // Indicates if users can't navigate back to previous questions.
    @Column()
    cant_go_back: boolean

    // The access code required to access the quiz.
    @Column()
    access_code: string | null

    // The IP filter applied to the quiz.
    @Column()
    ip_filter: string | null

    // The due date for the quiz.
    @Column()
    due_at: Date | null

    // The lock date for the quiz.
    @Column()
    lock_at: Date | null

    // The unlock date for the quiz.
    @Column()
    unlock_at: Date | null

    // Indicates if the quiz is published.
    @Column()
    published: boolean

    // Indicates if the quiz can be unpublished.
    @Column()
    unpublishable: boolean

    // Indicates if the quiz is locked for the user.
    @Column()
    locked_for_user: boolean

    // Information about the quiz lock.
    @Column()
    lock_info: {
        missing_permission: string
        asset_string: string
    }

    // Explanation for why the quiz is locked.
    @Column()
    lock_explanation: string

    // Indicates if results are hidden for the quiz.
    @Column()
    hide_results: boolean | null

    // The date when correct answers are shown.
    @Column()
    show_correct_answers_at: Date | null

    // The date when correct answers are hidden.
    @Column()
    hide_correct_answers_at: Date | null

    // Dates associated with the quiz.
    @Column()
    all_dates: {
        due_at: Date | null
        unlock_at: Date | null
        lock_at: Date | null
        base: boolean
    }[]

    // Indicates if the quiz can be unpublished.
    @Column()
    can_unpublish: boolean

    // Indicates if the quiz can be updated.
    @Column()
    can_update: boolean

    // Indicates if a lockdown browser is required for the quiz.
    @Column()
    require_lockdown_browser: boolean

    // Indicates if a lockdown browser is required to view results.
    @Column()
    require_lockdown_browser_for_results: boolean

    // Indicates if a lockdown browser monitor is required for the quiz.
    @Column()
    require_lockdown_browser_monitor: boolean

    // Data related to lockdown browser monitoring.
    @Column()
    lockdown_browser_monitor_data: unknown

    // The URL for speed grader associated with the quiz.
    @Column()
    speed_grader_url: string

    // Permissions related to the quiz.
    @Column()
    permissions: {
        manage: boolean
        read: boolean
        create: boolean
        update: boolean
        submit: boolean
        preview: boolean
        delete: boolean
        read_statistics: boolean
        grade: boolean
        review_grades: boolean
        view_answer_audits: boolean
    }

    // The URL for accessing quiz reports.
    @Column()
    quiz_reports_url: string

    // The URL for accessing quiz statistics.
    @Column()
    quiz_statistics_url: string

    // The URL for messaging students regarding the quiz.
    @Column()
    message_students_url: string

    // The number of sections in the quiz.
    @Column()
    section_count: number

    // Indicates if important dates are associated with the quiz.
    @Column()
    important_dates: boolean

    // The URL for accessing quiz submission versions.
    @Column()
    quiz_submission_versions_html_url: string

    // The unique identifier for the associated assignment.
    @OneToOne('Assignment')
    @Column()
    assignment: Assignment

    // Indicates if results are only visible one time.
    @Column()
    one_time_results: boolean

    // Indicates if the quiz is only visible to overrides.
    @Column()
    only_visible_to_overrides: boolean

    // The unique identifier for the associated assignment group.
    @Column()
    assignment_group_id: number

    // Indicates if correct answers are shown after the last attempt.
    @Column()
    show_correct_answers_last_attempt: boolean

    // The version number of the quiz.
    @Column()
    version_number: number

    // Indicates if an access code is required for the quiz.
    @Column()
    has_access_code: boolean

    // Indicates if quiz data should be posted to the SIS (Student Information System).
    @Column()
    post_to_sis: boolean

    // The migration identifier for the quiz.
    @Column()
    migration_id: number

    // Indicates if the quiz is in a paced course.
    @Column()
    in_paced_course: boolean

    // Types of questions present in the quiz.
    @Column()
    question_types: string[]

    @OneToMany('QuizQuestion', (quizQuestion: QuizQuestion) => quizQuestion.quiz)
    @JoinColumn()
    quiz_questions: QuizQuestion[]

    @OneToMany('QuizSubmission', (quizSubmission: QuizSubmission) => quizSubmission.quiz)
    @JoinColumn()
    quiz_submissions: QuizSubmission[]

    @UpdateDateColumn()
    date_last_received_from_canvas: Date
}
