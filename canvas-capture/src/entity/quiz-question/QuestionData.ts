/**
 * Defines types matching quiz question-related
 * portions of the Canvas API
 */
import 'reflect-metadata'
import { Column, Entity, OneToMany, UpdateDateColumn } from 'typeorm'
import type { QuizSubmissionAnswer } from '../entity.types'
import CanvasEntity from '../canvas-entity'

@Entity()
export class QuestionData extends CanvasEntity {
    @Column({ type: 'numeric' })
    quiz_id: number

    @Column({ type: 'text' })
    question_name: string

    @Column({ type: 'text' })
    question_description: string

    @Column({ type: 'numeric' })
    position: number

    @Column({ type: 'numeric' })
    points_possible: number

    @Column({ type: 'text' })
    correct_comments: string

    @Column({ type: 'text' })
    neutral_comments: string

    @Column({ type: 'text' })
    incorrect_comments: string

    @OneToMany(
        'QuizSubmissionAnswer',
        (quizSubmissionAnswer: QuizSubmissionAnswer) =>
            quizSubmissionAnswer.question_data
    )
    correct_answers: QuizSubmissionAnswer[]

    @Column({ type: 'text' })
    correct: boolean | 'partial'

    @Column({ type: 'text' })
    question_type: string //should eventually make this explicit

    @UpdateDateColumn()
    date_last_received_from_canvas: Date

    constructor(data?: Partial<QuestionData>) {
        super(data)
        Object.assign(this, data)
    }
}
