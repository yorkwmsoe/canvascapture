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
import type { QuestionData, QuizQuestion } from '../entity.types'
import CanvasEntity from '../canvas-entity'

@Entity()
export class QuizSubmissionAnswer extends CanvasEntity {
    // Unique identifier for the answer
    @PrimaryColumn({ type: 'text' })
    id: string

    // The text of the answer
    @Column({ type: 'text' })
    text: string

    // Comments for the answer
    @Column({ type: 'text' })
    comments: string

    // HTML representation of the comments
    @Column({ type: 'text' })
    comments_html: string

    // Weight of the answer
    @Column({ type: 'numeric' })
    weight: number

    // Identifier for the blank associated with the answer
    @Column({ type: 'text' })
    blank_id: string

    @ManyToOne(
        'QuizQuestion',
        (quizQuestion: QuizQuestion) => quizQuestion.answers
    )
    @JoinColumn()
    quiz_question: QuizQuestion

    @ManyToOne(
        'QuestionData',
        (questionData: QuestionData) => questionData.correct_answers
    )
    @JoinColumn()
    question_data: QuestionData

    @UpdateDateColumn()
    date_last_received_from_canvas: Date

    constructor(data?: Partial<QuizSubmissionAnswer>) {
        super(data)
        Object.assign(this, data)
    }
}
