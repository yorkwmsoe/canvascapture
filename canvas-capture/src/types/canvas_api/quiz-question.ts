type Answer = {
    // Unique identifier for the answer
    id: number
    // The text content of the answer
    text: string
    // Optional HTML content of the answer
    html: string
}

type QuizQuestion = {
    // Unique identifier for the question
    id: number
    // Identifier for the quiz this question belongs to
    quiz_id: number
    // Identifier for the group this question belongs to, or null if not in a group
    quiz_group_id: number | null
    // Identifier for the assessment question
    assessment_question_id: number
    // Position of the question within the quiz
    position: number
    // Name or title of the question
    question_name: string
    // Type of the question (e.g., multiple choice, true/false, etc.)
    question_type: string
    // The text content of the question
    question_text: string
    // Array of possible answers for the question
    answers: Answer[]
    // Optional variables associated with the question
    variables: any | null
    // Optional formulas associated with the question
    formulas: any | null
    // Optional tolerance for answers
    answer_tolerance: any | null
    // Optional decimal places for formulas
    formula_decimal_places: number | null
    // Optional matches associated with the question
    matches: any | null
    // Indicates if the question is flagged
    flagged: boolean
    // Indicates if the question is answered correctly
    correct: boolean
}
