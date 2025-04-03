/**
 * Defines a type matching the quiz submission-related
 * portion of the Canvas API
 */
import 'reflect-metadata'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import type { Quiz } from '../entity.types'
import CanvasEntity from '../canvas-entity'

@Entity()
export class QuizSubmission extends CanvasEntity {
    // The unique identifier for the quiz submission.
    @PrimaryColumn({ type: 'numeric' })
    id: number

    @ManyToOne('Quiz', (quiz: Quiz) => quiz.quiz_submissions)
    @JoinColumn()
    quiz: Quiz

    // The version of the quiz associated with the submission.
    @Column({ type: 'numeric' })
    quiz_version: number

    // The ID of the user who submitted the quiz, or null if not available.
    @Column({ nullable: true, type: 'numeric' })
    user_id: number | null

    // The ID of the submission, if available.
    @Column({ nullable: true, type: 'numeric' })
    submission_id: number | null

    // The score obtained in the quiz, or null if not available.
    @Column({ nullable: true, type: 'numeric' })
    score: number | null

    // The score kept for the submission, if applicable.
    @Column({ nullable: true, type: 'numeric' })
    kept_score: number | null

    // The date and time when the quiz submission started.
    @Column({ nullable: true, type: 'date' })
    started_at: Date | null

    // The date and time when the quiz submission ended, if available.
    @Column({ nullable: true, type: 'date' })
    end_at: Date | null

    // The date and time when the quiz submission was finished, if available.
    @Column({ nullable: true, type: 'date' })
    finished_at: Date | null

    // The attempt number for the submission.
    @Column({ type: 'numeric' })
    attempt: number

    // The current state of the submission.
    @Column({ type: 'text' })
    workflow_state: string

    // The fudge points applied to the submission, if any.
    @Column({ nullable: true, type: 'numeric' })
    fudge_points: number | null

    // The maximum points possible for the quiz.
    @Column({ type: 'numeric' })
    quiz_points_possible: number

    // The number of extra attempts allowed for the submission, if any.
    @Column({ nullable: true, type: 'numeric' })
    extra_attempts: number | null

    // The extra time granted for the submission, if any.
    @Column({ nullable: true, type: 'numeric' })
    extra_time: number | null

    // Indicates if the submission was manually unlocked.
    @Column({ nullable: true, type: 'boolean' })
    manually_unlocked: boolean | null

    // The validation token associated with the submission.
    @Column({ type: 'text' })
    validation_token: string

    // The score before regrading, if applicable.
    @Column({ nullable: true, type: 'numeric' })
    score_before_regrade: number | null

    // Indicates if the user has seen the results.
    @Column({ nullable: true, type: 'boolean' })
    has_seen_results: boolean | null

    // The time spent on the quiz submission.
    @Column({ nullable: true, type: 'numeric' })
    time_spent: number | null

    // The number of attempts left for the submission.
    @Column({ type: 'numeric' })
    attempts_left: number

    // Indicates if the submission is overdue and needs submission.
    @Column({ type: 'boolean' })
    overdue_and_needs_submission: boolean

    // Indicates if the submission is excused.
    @Column({ nullable: true, type: 'boolean' })
    excused: boolean | null

    // The URL for accessing the quiz submission.
    @Column({ type: 'text' })
    html_url: string

    // The URL for the result
    @Column({ type: 'text' })
    result_url: string

    constructor(data?: Partial<QuizSubmission>) {
        super(data)
        Object.assign(this, data)
    }
}
