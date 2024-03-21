// import { Assignment } from './types/canvas_api/assignment'
// import { Submission } from './types/canvas_api/submission'
// import { Quiz } from './types/canvas_api/quiz'
// import { QuizSubmission } from './types/canvas_api/quiz-submissions'
// import {Auth, getQuizQuestions, GetQuizQuestionRequest} from './canvas.api'
// import {parse} from "node-html-parser";
//
// type UserGuess = {
//     guess: string,
//     isCorrect: boolean,
// }
//
// type QuestionInfo = {
//     questionId: string,
//     questionNum: string,
//     possiblePoints: string,
//     actualPoints: string,
//     questionType: string,
//     correctComments: string,
//     incorrectComments: string,
//     neutralComments: string,
//     additionalComments: string,
//     userGuesses: UserGuess[],
//     answers: string[],
// }
//
// async function parseQuizHTML(assignment: Assignment, auth: Auth, ){
//
//     let quizQuestionRequest: GetQuizQuestionRequest = {
//         quizSubmissionId: assignment.quiz_id as number
//     }
//     const quizQuestions = getQuizQuestions(quizQuestionRequest & auth)
//
//     // Log the content of the text file
//     const question_ids = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] //[3, 4, 19]//
//     const root = parse(data)
//     const bounds = [0, root.textContent]
//     let count = 1
//     for(const qid of question_ids) {
//         //Question Node HTML element
//         const question = root.querySelector("#question_" + qid)
//         //The order of the question e.g. Question <Number>
//         const questionSequence = question?.querySelector("span.name.question_name")?.innerText
//         //console.log(questionSequence)
//
//         // Score that the student got
//         const actualScore = question?.querySelector('#question_score_' + qid + '_visible')?.getAttribute("value")
//
//         // Total points for a question in string format
//         const questionPossiblePointsRaw = question?.querySelector("span.points.question_points")?.innerText
//
//         // Numerical points that are possible for question
//         const questionPossiblePoints = questionPossiblePointsRaw?.substring(questionPossiblePointsRaw?.indexOf("/") + 1).replace(/\s/g, "").trim();
//
//         // Question Type
//         const questionType = question?.querySelector("span.question_type")?.innerText
//
//         //Question Description
//         const questionDescription = question?.querySelector(".question_text.user_content")?.querySelector("p")?.innerText as string
//
//         // All the correctly Answered choices for question
//         let userGuesses: UserGuess[] = []
//
//         let additionalComments = question?.querySelector(".quiz_comment:not(:has(p)):not(.empty)")?.querySelector("textarea")?.innerHTML
//         let neutralComments = question?.querySelector(".quiz_comment p.neutral_comments")?.nextElementSibling?.innerText
//         let incorrectComments = question?.querySelector(".quiz_comment p.incorrect_comments")?.nextElementSibling?.innerText
//         let correctComments = question?.querySelector(".quiz_comment p.correct_comments")?.nextElementSibling?.innerText
//
//         // All correct answers for question
//         let correctAnswers: QuestionInfo = {
//             questionId: qid.toString(),
//             questionNum: questionSequence ? questionSequence.substring(9).trim() : "",
//             possiblePoints: questionPossiblePoints ? questionPossiblePoints : "",
//             actualPoints: actualScore ? actualScore : "",
//             questionType: questionType ? questionType : "",
//             correctComments: correctComments ? correctComments : "",
//             incorrectComments: incorrectComments ? incorrectComments : "",
//             neutralComments: neutralComments ? neutralComments : "",
//             additionalComments: additionalComments ? additionalComments : "",
//             userGuesses: [],
//             answers: [],
//         }
//
//         let individualAnswers: string[] = []
//
//
//         //use .selected_answer.correct_answer to grab all of the correctly selected answers
//         //use .selected_answer.wrong_answer to grab all of the incorrectly, selected answers
//         //use .correct_answer:not(.selected_answer) to grab the correctly selected answers, that were not selected
//
//         let selectedAnswers = question?.querySelectorAll(".selected_answer")
//         selectedAnswers?.map(selectedAnswer => {
//             let userGuess: UserGuess = {
//                 guess: "",
//                 isCorrect: false
//             }
//             if(selectedAnswer.classList.contains("correct_answer") && !selectedAnswer.classList.contains("skipped")){
//                 userGuess.isCorrect = true;
//                 if(questionType === "short_answer_question" || questionType === "numerical_question" || questionType == "formula_question" || questionType == "exact_answer" || questionType == "calculated_question"){
//                     userGuess.guess = question?.querySelector("input.question_input[type=text][name=question_" + qid + "]")?.getAttribute("value") as string
//                 } else {
//                     if(questionType == "fill_in_multiple_blanks_question"){
//                         userGuess.guess = selectedAnswer.innerText.trim()
//                     } else {
//                         userGuess.guess = selectedAnswer?.querySelector(".answer_text")?.innerText as string
//                     }
//                 }
//             } else if(selectedAnswer.classList.contains("wrong_answer")){
//                 userGuess.isCorrect = false;
//                 if(questionType === "short_answer_question" || questionType === "numerical_question" || questionType == "formula_question" || questionType == "exact_answer" || questionType == "calculated_question"){
//                     userGuess.guess = selectedAnswer?.querySelector("input.question_input[type=text][name=question_" + qid + "]")?.getAttribute("value") as string
//                 } else if(questionType == "fill_in_multiple_blanks_question") {
//                     userGuess.guess = selectedAnswer.innerText.trim()
//                 } else {
//                     userGuess.guess = selectedAnswer?.querySelector(".answer_text")?.innerText as string
//                 }
//
//             }
//             userGuesses.push(userGuess)
//         })
//
//         if(questionType == "fill_in_multiple_blanks_question" || questionType == "multiple_dropdowns_question" ){
//             const ids = question?.querySelectorAll(".blank_id")
//             const idset = new Set<string>();
//             ids?.map(id => {
//                 idset.add(id.innerText)
//             })
//             Array.from(idset).map(id => {
//                 const answerText = question?.querySelector(".correct_answer.answer_for_" + id)?.querySelector(".answer_text")?.innerText;
//                 individualAnswers.push(answerText !== undefined ? answerText : "");
//             })
//
//         } else {
//             let correctAnswers = question?.querySelectorAll(".answer_for_.answer.correct_answer")
//             correctAnswers?.map((correctAnswer) => {
//                 let answerText = undefined
//                 if(questionType == "numerical_question"){
//                     answerText = correctAnswer?.querySelector("span.answer_exact")?.innerText
//                 } else if(questionType == "calculated_question"){
//                     answerText = correctAnswer?.querySelector("span.answer_equation")?.innerText
//                 } else {
//                     answerText = correctAnswer.querySelector(".answer_text")?.innerText
//                 }
//                 answerText = answerText !== undefined ? answerText as string : " "
//                 individualAnswers.push(answerText)
//             })
//         }
//         correctAnswers.answers = [...individualAnswers]
//         correctAnswers.userGuesses = [...userGuesses]
//
//         console.log(correctAnswers)
//
//         //questionType === "essay_question" has no visual correctness, they either get the points or they don't.
//         //If they, do, just return the content within the essayQuestion
//
//         //questionType === "file_upload_question" has no visual correctness, they either get the points or they don't
//         // /files/4/download this is the endpoint that is given in the HTML
//         // This is the url to get information about the file http://sdlstudentvm06.msoe.edu/api/v1/file/4
//
//
//
//
//         //console.log(neutralComments, "----", incorrectComments, "----", correctComments)
//
//
//     }
//
// });
