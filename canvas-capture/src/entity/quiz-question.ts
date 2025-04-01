/**
 * Defines types matching quiz question-related
 * portions of the Canvas API
 */
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
} from 'typeorm'
import { QuizSubmissionQuestion } from './quiz-submission-question'

// from endpoint http://sdlstudentvm06.msoe.edu/api/v1/courses/2/quizzes/3/questions?&quiz_submission_id=9&quiz_submission_attempt=1
@Entity()
export class QuizQuestion {
    // Unique identifier for the question
    @Column()
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

    // Points possible for the question
    @Column()
    points_possible: number

    // Comments for correct answers
    @Column()
    correct_comments: string

    // Comments for incorrect answers
    @Column()
    incorrect_comments: string

    // Comments for neutral answers
    @Column()
    neutral_comments: string

    // HTML representation of correct comments
    @Column()
    correct_comments_html: string

    // HTML representation of incorrect comments
    @Column()
    incorrect_comments_html: string

    // HTML representation of neutral comments
    @Column()
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
    @Column()
    answer_tolerance: null | number

    // Decimal places for formulas
    @Column()
    formula_decimal_places: null | number

    // Matches associated with the question
    @OneToMany(() => Match, (match) => match.quiz_question)
    @JoinColumn()
    matches: Match[]

    // Matching answer incorrect matches
    matching_answer_incorrect_matches: null | string
}

@Entity()
export class QuizSubmissionAnswer {
    // Unique identifier for the answer
    @Column()
    id: string

    // The text of the answer
    @Column()
    text: string

    // Comments for the answer
    @Column()
    comments: string

    // HTML representation of the comments
    @Column()
    comments_html: string

    // Weight of the answer
    @Column()
    weight: number

    // Identifier for the blank associated with the answer
    @Column()
    blank_id: string

    @ManyToOne(() => QuizQuestion, (quizQuestion) => quizQuestion.answers)
    @JoinColumn()
    quiz_question: QuizQuestion
}

@Entity()
export class QuestionData {
    @Column()
    quiz_id: number

    @Column()
    question_name: string

    @Column()
    question_description: string

    @Column()
    position: number

    @Column()
    points_possible: number

    @Column()
    correct_comments: string

    @Column()
    neutral_comments: string

    @Column()
    incorrect_comments: string

    @Column()
    correct_answers: QuizSubmissionAnswer[]

    @Column()
    correct: boolean | 'partial'

    @Column()
    question_type: string //should eventually make this explicit
}

@Entity()
export class Variable {
    @Column()
    name: string

    @Column()
    min: number

    @Column()
    max: number

    @Column()
    scale: number

    @ManyToOne(() => QuizQuestion, (quizQuestion) => quizQuestion.variables)
    @JoinColumn()
    quiz_question?: QuizQuestion

    @ManyToOne(
        () => QuizSubmissionQuestion,
        (quizSubmissionQuestion) => quizSubmissionQuestion.variables
    )
    @JoinColumn()
    quiz_submission_question?: QuizSubmissionQuestion
}

@Entity()
export class Formula {
    @Column()
    formula: string

    @ManyToOne(() => QuizQuestion, (quizQuestion) => quizQuestion.formulas)
    @JoinColumn()
    quiz_question?: QuizQuestion

    @ManyToOne(
        () => QuizSubmissionQuestion,
        (quizSubmissionQuestion) => quizSubmissionQuestion.formulas
    )
    @JoinColumn()
    quiz_submission_question?: QuizSubmissionQuestion
}

@Entity()
export class Match {
    @Column()
    text: string

    @PrimaryColumn()
    match_id: number

    @ManyToOne(() => QuizQuestion, (quizQuestion) => quizQuestion.matches)
    @JoinColumn()
    quiz_question?: QuizQuestion

    @ManyToOne(
        () => QuizSubmissionQuestion,
        (quizSubmissionQuestion) => quizSubmissionQuestion.matches
    )
    @JoinColumn()
    quiz_submission_question?: QuizSubmissionQuestion
}
