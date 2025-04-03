/**
 * Defines types matching quiz question-related
 * portions of the Canvas API
 */
import 'reflect-metadata'
import type { QuizSubmissionQuestion } from './quiz-submission-question'
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm'
import { Quiz } from './quiz'
import CanvasEntity from './canvas-entity'

// from endpoint http://sdlstudentvm06.msoe.edu/api/v1/courses/2/quizzes/3/questions?&quiz_submission_id=9&quiz_submission_attempt=1
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
        () => QuizSubmissionAnswer,
        (quizSubmissionAnswer) => quizSubmissionAnswer.quiz_question
    )
    @JoinColumn()
    answers: QuizSubmissionAnswer[]

    // Variables associated with the question
    @OneToMany(() => Variable, (variable) => variable.quiz_question)
    @JoinColumn()
    variables: null | Variable[]

    // Formulas associated with the question
    @OneToMany(() => Formula, (formula) => formula.quiz_question)
    @JoinColumn()
    formulas: null | Formula[]

    // Tolerance for answer comparison
    @Column({ nullable: true, type: 'numeric' })
    answer_tolerance: null | number

    // Decimal places for formulas
    @Column({ nullable: true, type: 'numeric' })
    formula_decimal_places: null | number

    // Matches associated with the question
    @OneToMany(() => Match, (match) => match.quiz_question)
    @JoinColumn()
    matches: Match[]

    // Matching answer incorrect matches
    @Column({ nullable: true, type: 'text' })
    matching_answer_incorrect_matches: null | string

    @UpdateDateColumn({ type: 'date' })
    date_last_received_from_canvas: Date
}

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

    @UpdateDateColumn({ type: 'date' })
    date_last_received_from_canvas: Date
}

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

    @UpdateDateColumn({ type: 'date' })
    date_last_received_from_canvas: Date

    constructor(data: Partial<QuestionData>) {
        super(data)
        Object.assign(this, data)
    }
}

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

    @ManyToOne(() => QuizQuestion, (quizQuestion) => quizQuestion.variables)
    @JoinColumn()
    quiz_question?: QuizQuestion

    @ManyToOne(
        'QuizSubmissionQuestion',
        (quizSubmissionQuestion: QuizSubmissionQuestion) =>
            quizSubmissionQuestion.variables
    )
    @JoinColumn()
    quiz_submission_question?: QuizSubmissionQuestion

    @UpdateDateColumn({ type: 'date' })
    date_last_received_from_canvas: Date
}

@Entity()
export class Formula extends CanvasEntity {
    @Column({ type: 'text' })
    formula: string

    @Column({ nullable: true, type: 'numeric' })
    quiz_questionId?: number

    @ManyToOne(() => QuizQuestion, (quizQuestion) => quizQuestion.formulas)
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

    @UpdateDateColumn({ type: 'date' })
    date_last_received_from_canvas: Date
}

@Entity()
export class Match extends CanvasEntity {
    @Column({ type: 'text' })
    text: string

    @PrimaryColumn({ type: 'numeric' })
    match_id: number

    @Column({ nullable: true, type: 'number' })
    quiz_questionId?: number

    @ManyToOne(() => QuizQuestion, (quizQuestion) => quizQuestion.matches)
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

    @UpdateDateColumn({ type: 'date' })
    date_last_received_from_canvas: Date
}
