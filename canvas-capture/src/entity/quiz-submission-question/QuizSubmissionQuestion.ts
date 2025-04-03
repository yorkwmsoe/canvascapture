/**
 * Defines types matching quiz submission question-related
 * portions of the Canvas API
 */
import 'reflect-metadata'
import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm'
import type { Answer, Formula, Match, Variable } from '../entity.types'
import CanvasEntity from '../canvas-entity'

@Entity()
export class QuizSubmissionQuestion extends CanvasEntity {
    // Unique identifier for the question
    @PrimaryColumn({ type: 'numeric' })
    id: number

    // ID of the quiz this question belongs to
    @Column({ type: 'numeric' })
    quiz_id: number

    // ID of the quiz group if the question belongs to a group
    @Column({ nullable: true, type: 'numeric' })
    quiz_group_id: number | null

    // ID of the assessment question
    @Column({ type: 'numeric' })
    assessment_question_id: number

    // Position of the question within the quiz
    @Column({ type: 'numeric' })
    position: number

    // Name of the question
    @Column({ type: 'text' })
    question_name: string

    // Type of the question
    @Column({ type: 'text' })
    question_type: string

    // Text of the question
    @Column({ type: 'text' })
    question_text: string

    // List of answers for the question
    @OneToMany('Answer', (answer: Answer) => answer.quiz_submission_question)
    @JoinColumn()
    answers: Answer[]

    // Variables associated with the question
    @OneToMany(
        'Variable',
        (variable: Variable) => variable.quiz_submission_question
    )
    @JoinColumn()
    variables: Variable[]

    // Formulas associated with the question
    @OneToMany(
        'Formula',
        (formula: Formula) => formula.quiz_submission_question
    )
    @JoinColumn()
    formulas: Formula[]

    // Tolerance for answer comparison
    @Column({ nullable: true, type: 'numeric' })
    answer_tolerance: number | null

    // Decimal places for formulas
    @Column({ nullable: true, type: 'numeric' })
    formula_decimal_places: number | null

    // Matches associated with the question
    @OneToMany('Match', (match: Match) => match.quiz_submission_question)
    @JoinColumn()
    matches: Match[]

    // Indicates if the question is flagged
    @Column({ type: 'boolean' })
    flagged: boolean

    // Indicates if the question is correct
    @Column({ type: 'text' })
    correct: boolean | 'partial'

    constructor(data?: Partial<QuizSubmissionQuestion>) {
        super(data)
        Object.assign(this, data)
    }
}
