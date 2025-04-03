/**
 * Defines a type matching the quiz-related
 * portion of the Canvas API
 */
import 'reflect-metadata'
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryColumn,
} from 'typeorm'
import {
    Assignment,
    AssignmentGroup,
    QuestionData,
    QuizQuestion,
    QuizSubmission,
} from '../entity.types'
import CanvasEntity from '../canvas-entity'

@Entity()
export class Quiz extends CanvasEntity {
    // The unique identifier for the quiz.
    @PrimaryColumn({ type: 'numeric' })
    id: number

    // The title of the quiz.
    @Column({ type: 'text' })
    title: string

    // The URL for accessing the quiz in a web browser.
    @Column({ type: 'text' })
    html_url: string

    // The URL for accessing the quiz in a mobile browser.
    @Column({ type: 'text' })
    mobile_url: string

    // The description of the quiz.
    @Column({ type: 'text' })
    description: string

    // The type of the quiz.
    @Column({ type: 'text' })
    quiz_type: string

    // The time limit for completing the quiz, if any.
    @Column({ nullable: true, type: 'numeric' })
    time_limit: number | null

    // Indicates if the timer auto-submit feature is disabled.
    @Column({ type: 'boolean' })
    timer_autosubmit_disabled: boolean

    // Indicates if answers are shuffled for the quiz.
    @Column({ type: 'boolean' })
    shuffle_answers: boolean

    // Indicates if correct answers are shown after submission.
    @Column({ type: 'boolean' })
    show_correct_answers: boolean

    // The scoring policy for the quiz.
    @Column({ type: 'text' })
    scoring_policy: string

    // The number of attempts allowed for the quiz.
    @Column({ type: 'numeric' })
    allowed_attempts: number

    // Indicates if only one question can be answered at a time.
    @Column({ type: 'numeric' })
    one_question_at_a_time: boolean

    // The number of questions in the quiz.
    @Column({ type: 'numeric' })
    question_count: number

    // The maximum points possible for the quiz.
    @Column({ type: 'numeric' })
    points_possible: number

    // Indicates if users can't navigate back to previous questions.
    @Column({ type: 'boolean' })
    cant_go_back: boolean

    // The access code required to access the quiz.
    @Column({ nullable: true, type: 'text' })
    access_code: string | null

    // The IP filter applied to the quiz.
    @Column({ nullable: true, type: 'text' })
    ip_filter: string | null

    // The due date for the quiz.
    @Column({ nullable: true, type: 'date' })
    due_at: Date | null

    // The lock date for the quiz.
    @Column({ nullable: true, type: 'date' })
    lock_at: Date | null

    // The unlock date for the quiz.
    @Column({ nullable: true, type: 'date' })
    unlock_at: Date | null

    // Indicates if the quiz is published.
    @Column({ type: 'boolean' })
    published: boolean

    // Indicates if the quiz can be unpublished.
    @Column({ type: 'boolean' })
    unpublishable: boolean

    // Indicates if the quiz is locked for the user.
    @Column({ type: 'boolean' })
    locked_for_user: boolean

    // Information about the quiz lock.
    @Column({ type: 'simple-json' })
    lock_info: {
        missing_permission: string
        asset_string: string
    }

    // Explanation for why the quiz is locked.
    @Column({ type: 'text' })
    lock_explanation: string

    // Indicates if results are hidden for the quiz.
    @Column({ nullable: true, type: 'boolean' })
    hide_results: boolean | null

    // The date when correct answers are shown.
    @Column({ nullable: true, type: 'date' })
    show_correct_answers_at: Date | null

    // The date when correct answers are hidden.
    @Column({ nullable: true, type: 'date' })
    hide_correct_answers_at: Date | null

    // Dates associated with the quiz.
    @Column({ type: 'simple-array' })
    all_dates: {
        due_at: Date | null
        unlock_at: Date | null
        lock_at: Date | null
        base: boolean
    }[]

    // Indicates if the quiz can be unpublished.
    @Column({ type: 'boolean' })
    can_unpublish: boolean

    // Indicates if the quiz can be updated.
    @Column({ type: 'boolean' })
    can_update: boolean

    // Indicates if a lockdown browser is required for the quiz.
    @Column({ type: 'boolean' })
    require_lockdown_browser: boolean

    // Indicates if a lockdown browser is required to view results.
    @Column({ type: 'boolean' })
    require_lockdown_browser_for_results: boolean

    // Indicates if a lockdown browser monitor is required for the quiz.
    @Column({ type: 'boolean' })
    require_lockdown_browser_monitor: boolean

    // Data related to lockdown browser monitoring.
    @Column({ type: 'simple-json' })
    lockdown_browser_monitor_data: object

    // The URL for speed grader associated with the quiz.
    @Column({ type: 'text' })
    speed_grader_url: string

    // Permissions related to the quiz.
    @Column({ type: 'simple-json' })
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
    @Column({ type: 'text' })
    quiz_reports_url: string

    // The URL for accessing quiz statistics.
    @Column({ type: 'text' })
    quiz_statistics_url: string

    // The URL for messaging students regarding the quiz.
    @Column({ type: 'text' })
    message_students_url: string

    // The number of sections in the quiz.
    @Column({ type: 'numeric' })
    section_count: number

    // Indicates if important dates are associated with the quiz.
    @Column({ type: 'boolean' })
    important_dates: boolean

    // The URL for accessing quiz submission versions.
    @Column({ type: 'text' })
    quiz_submission_versions_html_url: string

    // The unique identifier for the associated assignment.
    @OneToOne('Assignment', (assignment: Assignment) => assignment.quiz)
    @JoinColumn()
    assignment: Assignment

    // Indicates if results are only visible one time.
    @Column({ type: 'boolean' })
    one_time_results: boolean

    // Indicates if the quiz is only visible to overrides.
    @Column({ type: 'boolean' })
    only_visible_to_overrides: boolean

    // The unique identifier for the associated assignment group.
    @ManyToOne(
        'AssignmentGroup',
        (assigmentGroup: AssignmentGroup) => assigmentGroup.quizzes
    )
    @JoinColumn()
    assignment_group: AssignmentGroup

    // Indicates if correct answers are shown after the last attempt.
    @Column({ type: 'boolean' })
    show_correct_answers_last_attempt: boolean

    // The version number of the quiz.
    @Column({ type: 'numeric' })
    version_number: number

    // Indicates if an access code is required for the quiz.
    @Column({ type: 'boolean' })
    has_access_code: boolean

    // Indicates if quiz data should be posted to the SIS (Student Information System).
    @Column({ type: 'boolean' })
    post_to_sis: boolean

    // The migration identifier for the quiz.
    @Column({ type: 'numeric' })
    migration_id: number

    // Indicates if the quiz is in a paced course.
    @Column({ type: 'boolean' })
    in_paced_course: boolean

    // Types of questions present in the quiz.
    @Column({ type: 'simple-array' })
    question_types: string[]

    @OneToMany(
        'QuizQuestion',
        (quizQuestion: QuizQuestion) => quizQuestion.quiz
    )
    @JoinColumn()
    quiz_questions: QuizQuestion[]

    @OneToMany(
        'QuestionData',
        (questionData: QuestionData) => questionData.quiz
    )
    @JoinColumn()
    question_data: QuestionData[]

    @OneToMany(
        'QuizSubmission',
        (quizSubmission: QuizSubmission) => quizSubmission.quiz
    )
    @JoinColumn()
    quiz_submissions: QuizSubmission[]

    constructor(data?: Partial<Quiz>) {
        super(data)
        Object.assign(this, data)
    }
}
