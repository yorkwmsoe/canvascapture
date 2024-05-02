import { http, HttpResponse } from 'msw'
import {
    assignmentsRawJSON,
    submissionsRawJSON,
    courseRawJSON,
    quizRawJSON,
    quizSubmissionJSON,
    quizFromQuizzesRawJSON,
    //quizSubmissionQuestionsRawJSON,
    quizQuestionsNoParamsRawJSON,
    quizQuestionsParamsRawJSON,
    courseWithQuiz,
    assignmentWhichIsQuiz,
    submissionForQuiz,
        quizSubmissionsFullResponseRawJSON,
    quizSubmissionQuestionsOrganizationRawJSON,
    quiz2QuestionsNoParamsRawJSON,
    quiz2QuestionsParamsRawJSON,
} from './canvas.api.mocks'

const sampleOptions = { status: 200, statusText: 'OK' }

export const handlers = [
    // Demo Handler
    http.get('https://example.com/user', () => {
        return HttpResponse.json({
            id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d',
            firstName: 'John',
            lastName: 'Maverick',
        })
    }),

    // Courses Handler
    http.get(
        'http://sdlstudentvm06.msoe.edu/api/v1/courses?exclude_blueprint_courses&per_page=1000',
        () => {
            return new Response(courseRawJSON, sampleOptions)
        }
    ),

    //Get Specific Course
    http.get(
        'http://sdlstudentvm06.msoe.edu/api/v1/courses/1',
        () => {
            return new Response(courseWithQuiz, sampleOptions)
        }
    ),

    //Assignments Handler
    http.get(
        'http://sdlstudentvm06.msoe.edu/api/v1/courses/1/assignments?per_page=1000',
        () => {
            return new Response(assignmentsRawJSON, sampleOptions)
        }
    ),

    //get specific assignment
    http.get(
        'http://sdlstudentvm06.msoe.edu/api/v1/courses/2/assignments/7',
        () => {
            return new Response(assignmentWhichIsQuiz, sampleOptions)
        }
    ),

    //Submissions Handler
    http.get(
        'http://sdlstudentvm06.msoe.edu/api/v1/courses/1/assignments/4/submissions?include[]=rubric_assessment&include[]=submission_comments&per_page=1000',
        () => {
            return new Response(submissionsRawJSON, sampleOptions)
        }
    ),

    //Submission for quiz
    http.get(
        'http://sdlstudentvm06.msoe.edu/api/v1/courses/2/assignments/7/submissions?include[]=rubric_assessment&include[]=submission_comments&per_page=1000',
        () => {
            return new Response(submissionForQuiz, sampleOptions)
        }
    ),

    // Quiz Header
    http.get(
        'http://sdlstudentvm06.msoe.edu/api/v1/courses/1/quizzes/4',
        () => {
            return new Response(quizRawJSON, sampleOptions)
        }
    ),

    // getQuizSubmission Header
    http.get(
        'http://sdlstudentvm06.msoe.edu/api/v1/courses/1/quizzes/1/submissions',
        () => {
            return new Response(quizSubmissionJSON, sampleOptions)
        }
    ),

        // For quiz 1 of course 1
    http.get(
        'http://sdlstudentvm06.msoe.edu/api/v1/courses/1/quizzes/1',
        () => {
            return new Response(quizFromQuizzesRawJSON, sampleOptions)
        }
    ),

    // For all quiz 2 submissions from course 2
    http.get(
        'http://sdlstudentvm06.msoe.edu/api/v1/courses/2/quizzes/2/submissions',
        () => {
            return new Response(quizSubmissionsFullResponseRawJSON, sampleOptions)
        }
    ),

    //For quiz Submisison Questions for quizSubmissionId of 14
    http.get(
        'http://sdlstudentvm06.msoe.edu/api/v1/quiz_submissions/14/questions?include[]=quiz_question',
        () => {
            //
            return new Response(quizSubmissionQuestionsOrganizationRawJSON, sampleOptions)
        }
    ),

    // For all questions in quiz 3 of course 2
    http.get(
        'http://sdlstudentvm06.msoe.edu/api/v1/courses/2/quizzes/3/questions',
        ({ request }) => {
            const url = new URL(request.url)
            const quizSubmissionId = url.searchParams.get('quiz_submission_id')
            const quizSubmissionAttempt = url.searchParams.get(
                'quiz_submission_attempt'
            )
            if (!quizSubmissionId || !quizSubmissionAttempt) {
                return new Response(quizQuestionsNoParamsRawJSON, sampleOptions)
            }
            return new Response(quizQuestionsParamsRawJSON, sampleOptions)
        }
    ),

    // For all questions of quiz 2 of course 2. Section for parameters and one for no parameters
    http.get(
        'http://sdlstudentvm06.msoe.edu/api/v1/courses/2/quizzes/2/questions',
        ({ request }) => {
            const url = new URL(request.url)
            const quizSubmissionId = url.searchParams.get('quiz_submission_id')
            const quizSubmissionAttempt = url.searchParams.get(
                'quiz_submission_attempt'
            )
            if (!quizSubmissionId || !quizSubmissionAttempt) {
                return new Response(quiz2QuestionsNoParamsRawJSON, sampleOptions)
            }
            return new Response(quiz2QuestionsParamsRawJSON, sampleOptions)
        }
    ),

]
