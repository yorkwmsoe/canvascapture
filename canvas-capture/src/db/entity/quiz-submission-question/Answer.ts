/**
 * Defines types matching quiz submission question-related
 * portions of the Canvas API
 */
import 'reflect-metadata'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import type { QuizSubmissionQuestion } from '../entity.types'
import CanvasEntity from '../canvas-entity'

@Entity()
export class Answer extends CanvasEntity {
    // Unique identifier for the answer
    @PrimaryColumn({ type: 'numeric' })
    id: number

    // The text of the answer
    @Column({ type: 'text' })
    text: string

    // HTML representation of the answer
    @Column({ type: 'text' })
    html: string

    @ManyToOne(
        'QuizSubmissionQuestion',
        (quizSubmissionQuestion: QuizSubmissionQuestion) =>
            quizSubmissionQuestion.answers
    )
    @JoinColumn()
    quiz_submission_question: QuizSubmissionQuestion

    constructor(data?: Partial<Answer>) {
        super(data)
        Object.assign(this, data)
    }
}
