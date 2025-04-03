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
    UpdateDateColumn,
} from 'typeorm'
import type { QuizQuestion, QuizSubmissionQuestion } from '../entity.types'
import CanvasEntity from '../canvas-entity'

@Entity()
export class Formula extends CanvasEntity {
    @Column({ type: 'text' })
    formula: string

    @Column({ nullable: true, type: 'numeric' })
    quiz_questionId?: number

    @ManyToOne(
        'QuizQuestion',
        (quizQuestion: QuizQuestion) => quizQuestion.formulas
    )
    @JoinColumn()
    quiz_question?: QuizQuestion

    @Column({ nullable: true, type: 'numeric' })
    quiz_submission_questionId: number

    @ManyToOne(
        'QuizSubmissionQuestion',
        (quizSubmissionQuestion: QuizSubmissionQuestion) =>
            quizSubmissionQuestion.formulas
    )
    @JoinColumn()
    quiz_submission_question?: QuizSubmissionQuestion

    @UpdateDateColumn()
    date_last_received_from_canvas: Date

    constructor(data?: Partial<Formula>) {
        super(data)
        Object.assign(this, data)
    }
}
