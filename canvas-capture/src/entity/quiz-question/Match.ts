/**
 * Defines types matching quiz question-related
 * portions of the Canvas API
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
import type { QuizQuestion, QuizSubmissionQuestion } from '../entity.types'
import CanvasEntity from '../canvas-entity'

@Entity()
export class Match extends CanvasEntity {
    @Column({ type: 'text' })
    text: string

    @PrimaryColumn({ type: 'numeric' })
    match_id: number

    @Column({ nullable: true, type: 'number' })
    quiz_questionId?: number

    @ManyToOne(
        'QuizQuestion',
        (quizQuestion: QuizQuestion) => quizQuestion.matches
    )
    @JoinColumn()
    quiz_question?: QuizQuestion

    @Column({ nullable: true, type: 'number' })
    quiz_submission_questionId?: number

    @ManyToOne(
        'QuizSubmissionQuestion',
        (quizSubmissionQuestion: QuizSubmissionQuestion) =>
            quizSubmissionQuestion.matches
    )
    @JoinColumn()
    quiz_submission_question?: QuizSubmissionQuestion

    @UpdateDateColumn()
    date_last_received_from_canvas: Date

    constructor(data?: Partial<Match>) {
        super(data)
        Object.assign(this, data)
    }
}
