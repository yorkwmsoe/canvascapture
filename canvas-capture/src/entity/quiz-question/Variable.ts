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
export class Variable extends CanvasEntity {
    @Column({ type: 'text' })
    name: string

    @Column({ type: 'numeric' })
    min: number

    @Column({ type: 'numeric' })
    max: number

    @Column({ type: 'numeric' })
    scale: number

    @Column({ nullable: true, type: 'numeric' })
    quiz_questionId: number

    @ManyToOne(
        'QuizQuestion',
        (quizQuestion: QuizQuestion) => quizQuestion.variables
    )
    @JoinColumn()
    quiz_question?: QuizQuestion

    @ManyToOne(
        'QuizSubmissionQuestion',
        (quizSubmissionQuestion: QuizSubmissionQuestion) =>
            quizSubmissionQuestion.variables
    )
    @JoinColumn()
    quiz_submission_question?: QuizSubmissionQuestion

    @UpdateDateColumn()
    date_last_received_from_canvas: Date

    constructor(data?: Partial<Variable>) {
        super(data)
        Object.assign(this, data)
    }
}
