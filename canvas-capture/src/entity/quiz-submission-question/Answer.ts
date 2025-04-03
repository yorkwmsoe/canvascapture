/**
 * Defines types matching quiz submission question-related
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
import type { QuizSubmissionQuestion } from '../entity.types'
import CanvasEntity from '../canvas-entity'

@Entity()
export class Answer extends CanvasEntity {
    // Unique identifier for the answer
    @PrimaryColumn()
    id: number

    // The text of the answer
    @Column()
    text: string

    // HTML representation of the answer
    @Column()
    html: string

    @ManyToOne(
        'QuizSubmissionQuestion',
        (quizSubmissionQuestion: QuizSubmissionQuestion) =>
            quizSubmissionQuestion.answers
    )
    @JoinColumn()
    quiz_submission_question: QuizSubmissionQuestion

    @UpdateDateColumn()
    date_last_received_from_canvas: Date

    constructor(data?: Partial<Answer>) {
        super(data)
        Object.assign(this, data)
    }
}
