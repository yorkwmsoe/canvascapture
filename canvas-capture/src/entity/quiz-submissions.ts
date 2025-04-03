/**
 * Defines a type matching the quiz submission-related
 * portion of the Canvas API
 */
import 'reflect-metadata'
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm'
import type { Quiz } from './quiz'
import CanvasEntity from './canvas-entity'

@Entity()
export class QuizSubmission extends CanvasEntity {
    // The unique identifier for the quiz submission.
    @PrimaryColumn()
    id: number

    @ManyToOne('Quiz', (quiz: Quiz) => quiz.quiz_submissions)
    @JoinColumn()
    quiz: Quiz

    // The version of the quiz associated with the submission.
    @Column()
    quiz_version: number

    // The ID of the user who submitted the quiz, or null if not available.
    @Column()
    user_id: number | null

    // The ID of the submission, if available.
    @Column()
    submission_id: number | null

    // The score obtained in the quiz, or null if not available.
    @Column()
    score: number | null

    // The score kept for the submission, if applicable.
    @Column()
    kept_score: number | null

    // The date and time when the quiz submission started.
    @Column()
    started_at: Date | null

    // The date and time when the quiz submission ended, if available.
    @Column()
    end_at: Date | null

    // The date and time when the quiz submission was finished, if available.
    @Column()
    finished_at: Date | null

    // The attempt number for the submission.
    @Column()
    attempt: number

    // The current state of the submission.
    @Column()
    workflow_state: string

    // The fudge points applied to the submission, if any.
    @Column()
    fudge_points: number | null

    // The maximum points possible for the quiz.
    @Column()
    quiz_points_possible: number

    // The number of extra attempts allowed for the submission, if any.
    @Column()
    extra_attempts: number | null

    // The extra time granted for the submission, if any.
    @Column()
    extra_time: number | null

    // Indicates if the submission was manually unlocked.
    @Column()
    manually_unlocked: boolean | null

    // The validation token associated with the submission.
    @Column()
    validation_token: string

    // The score before regrading, if applicable.
    @Column()
    score_before_regrade: number | null

    // Indicates if the user has seen the results.
    @Column()
    has_seen_results: boolean | null

    // The time spent on the quiz submission.
    @Column()
    time_spent: number | null

    // The number of attempts left for the submission.
    @Column()
    attempts_left: number

    // Indicates if the submission is overdue and needs submission.
    @Column()
    overdue_and_needs_submission: boolean

    // Indicates if the submission is excused.
    @Column()
    excused: boolean | null

    // The URL for accessing the quiz submission.
    @Column()
    html_url: string

    // The URL for the result
    @Column()
    result_url: string

    @UpdateDateColumn()
    date_last_received_from_canvas: Date
}
