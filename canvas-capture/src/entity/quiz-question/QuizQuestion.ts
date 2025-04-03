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
    OneToMany,
    PrimaryColumn,
} from 'typeorm'
import type {
    Formula,
    Match,
    Quiz,
    QuizSubmissionAnswer,
    Variable,
} from '../entity.types'
import CanvasEntity from '../canvas-entity'

@Entity()
export class QuizQuestion extends CanvasEntity {
    // Unique identifier for the question
    @PrimaryColumn({ type: 'numeric' })
    id: number

    // ID of the quiz this question belongs to
    @ManyToOne('Quiz', (quiz: Quiz) => quiz.quiz_questions)
    @JoinColumn()
    quiz: Quiz

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

    // Points possible for the question
    @Column({ type: 'numeric' })
    points_possible: number

    // Comments for correct answers
    @Column({ type: 'text' })
    correct_comments: string

    // Comments for incorrect answers
    @Column({ type: 'text' })
    incorrect_comments: string

    // Comments for neutral answers
    @Column({ type: 'text' })
    neutral_comments: string

    // HTML representation of correct comments
    @Column({ type: 'text' })
    correct_comments_html: string

    // HTML representation of incorrect comments
    @Column({ type: 'text' })
    incorrect_comments_html: string

    // HTML representation of neutral comments
    @Column({ type: 'text' })
    neutral_comments_html: string

    // List of answers for the question
    @OneToMany(
        'QuizSubmissionAnswer',
        (quizSubmissionAnswer: QuizSubmissionAnswer) =>
            quizSubmissionAnswer.quiz_question
    )
    @JoinColumn()
    answers: QuizSubmissionAnswer[]

    // Variables associated with the question
    @OneToMany('Variable', (variable: Variable) => variable.quiz_question)
    @JoinColumn()
    variables: null | Variable[]

    // Formulas associated with the question
    @OneToMany('Formula', (formula: Formula) => formula.quiz_question)
    @JoinColumn()
    formulas: null | Formula[]

    // Tolerance for answer comparison
    @Column({ nullable: true, type: 'numeric' })
    answer_tolerance: null | number

    // Decimal places for formulas
    @Column({ nullable: true, type: 'numeric' })
    formula_decimal_places: null | number

    // Matches associated with the question
    @OneToMany('Match', (match: Match) => match.quiz_question)
    @JoinColumn()
    matches: Match[]

    // Matching answer incorrect matches
    @Column({ nullable: true, type: 'text' })
    matching_answer_incorrect_matches: null | string

    constructor(data?: Partial<QuizQuestion>) {
        super(data)
        Object.assign(this, data)
    }
}
