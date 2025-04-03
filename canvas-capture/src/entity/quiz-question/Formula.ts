/**
 * Defines types matching quiz question-related
 * portions of the Canvas API
 */
import 'reflect-metadata'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import type { QuizQuestion, QuizSubmissionQuestion } from '../entity.types'
import CanvasEntity from '../canvas-entity'

@Entity()
export class Formula extends CanvasEntity {
    @PrimaryColumn({ type: 'text' })
    formula: string

    @Column({ nullable: true, type: 'numeric' })
    quiz_question_id?: number

    @ManyToOne(
        'QuizQuestion',
        (quizQuestion: QuizQuestion) => quizQuestion.formulas
    )
    @JoinColumn({ name: 'quiz_question_id' })
    quiz_question?: QuizQuestion

    @Column({ nullable: true, type: 'numeric' })
    quiz_submission_question_id: number

    @ManyToOne(
        'QuizSubmissionQuestion',
        (quizSubmissionQuestion: QuizSubmissionQuestion) =>
            quizSubmissionQuestion.formulas
    )
    @JoinColumn({ name: 'quiz_submission_question_id' })
    quiz_submission_question?: QuizSubmissionQuestion

    constructor(data?: Partial<Formula>) {
        super(data)
        Object.assign(this, data)
    }
}
