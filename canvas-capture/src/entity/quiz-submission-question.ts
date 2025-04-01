/**
 * Defines types matching quiz submission question-related
 * portions of the Canvas API
 */
import { Formula, Match, Variable } from './quiz-question'
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
} from 'typeorm'

@Entity()
export class QuizSubmissionQuestion {
    // Unique identifier for the question
    @PrimaryColumn()
    id: number

    // ID of the quiz this question belongs to
    @Column()
    quiz_id: number

    // ID of the quiz group if the question belongs to a group
    @Column()
    quiz_group_id: number | null

    // ID of the assessment question
    @Column()
    assessment_question_id: number

    // Position of the question within the quiz
    @Column()
    position: number

    // Name of the question
    @Column()
    question_name: string

    // Type of the question
    @Column()
    question_type: string

    // Text of the question
    @Column()
    question_text: string

    // List of answers for the question
    @OneToMany(() => Answer, (answer) => answer.quiz_submission_question)
    @JoinColumn()
    answers: Answer[]

    // Variables associated with the question
    @OneToMany(() => Variable, (variable) => variable.quiz_submission_question)
    @JoinColumn()
    variables: Variable[]

    // Formulas associated with the question
    @OneToMany(() => Formula, (formula) => formula.quiz_submission_question)
    @JoinColumn()
    formulas: Formula[]

    // Tolerance for answer comparison
    @Column()
    answer_tolerance: number | null

    // Decimal places for formulas
    @Column()
    formula_decimal_places: number | null

    // Matches associated with the question
    @OneToMany(() => Match, (match) => match.quiz_submission_question)
    @JoinColumn()
    matches: Match[]

    // Indicates if the question is flagged
    @Column()
    flagged: boolean

    // Indicates if the question is correct
    @Column()
    correct: boolean | 'partial'
}

@Entity()
export class Answer {
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
        () => QuizSubmissionQuestion,
        (quizSubmissionQuestion) => quizSubmissionQuestion
    )
    @JoinColumn()
    quiz_submission_question: QuizSubmissionQuestion
}
