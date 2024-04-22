import { Assignment } from './types/canvas_api/assignment'
import { Submission } from './types/canvas_api/submission'
import { Quiz } from './types/canvas_api/quiz'
import { QuizSubmission } from './types/canvas_api/quiz-submissions'
import {
    convertToHeader,
    createLinkNormal,
    createList,
    createTableHeader,
    createTableRows,
} from './markdown'

export function generateAssignment(
    assignment: Assignment,
    submission: Submission
) {
    const items = [
        ...assembleTitleAndGrade(assignment, submission, ''),
        ...assembleFeedbackInfo(submission),
        ...assembleDescriptionInfo(assignment),
        ...assembleRubricInfo(assignment, submission),
        ...assembleSubmissionInfo(submission),
    ]

    return items.filter((item) => !!item)
}

export function generateQuiz(
    assignment: Assignment,
    submission: Submission,
    quiz: Quiz,
    quizSubmission: QuizSubmission | undefined
) {
    const items = [
        ...assembleTitleAndGrade(assignment, submission, 'QUIZ: '),
        ...assembleDescriptionInfo(assignment),
        ...assembleFeedbackInfo(submission),
        ...quizOverview(assignment, quiz),
        ...quizUserOverview(submission, quizSubmission),
    ]

    return items.filter((item) => !!item)
}

function quizOverview(assignment: Assignment, quiz: Quiz) {
    const quiz_id = assignment.quiz_id as number
    const infoHeader = convertToHeader('Quiz Info', 2)
    const quizHeader = createTableHeader([
        'Quiz Id',
        'Assignment Id',
        '# of Questions',
        'Total Points',
        'Version #',
    ])
    const quizBody = createTableRows([
        [
            quiz_id.toString(),
            assignment.id.toString(),
            quiz.question_count.toString(),
            quiz.points_possible.toString(),
            quiz.version_number.toString(),
        ],
    ])
    return [infoHeader, quizHeader + quizBody]
}

function quizUserOverview(
    submission: Submission,
    quizSubmission: QuizSubmission | undefined
) {
    const userOverviewHeader = convertToHeader('User Overview', 2)
    const userHeader = createTableHeader([
        'User Id',
        'Score',
        'Kept Score',
        'Attempt',
    ])
    const rows: string[] = []
    rows.push(submission.user_id.toString())
    if (quizSubmission?.score) {
        rows.push(quizSubmission.score.toString())
    }
    if (quizSubmission?.kept_score) {
        rows.push(quizSubmission.kept_score.toString())
    }
    if (quizSubmission?.attempt) {
        rows.push(quizSubmission.attempt.toString())
    }
    const userBody = createTableRows([rows])
    return [userOverviewHeader, userHeader + userBody]
}

function assembleTitleAndGrade(
    assignment: Assignment,
    submission: Submission,
    type: string
) {
    const title = convertToHeader(type + assignment.name, 1)
    const grade = `${submission.score}/${assignment.points_possible}`
    return [title, grade]
}

function assembleDescriptionInfo(assignment: Assignment) {
    const descriptionHeader = convertToHeader('Description', 2)
    const description = assignment.description
        ? '\n<code>\n' + assignment.description + '\n</code>\n'
        : 'No description'
    return [descriptionHeader, description]
}

function assembleSubmissionInfo(submission: Submission) {
    const submissionHeader = convertToHeader('Submission', 2)
    switch (submission.submission_type) {
        case 'online_text_entry': {
            const submissionBody =
                '\n<code>\n' + submission.body + '\n</code>\n'
            return [submissionHeader, submissionBody]
        }
        case 'online_quiz': {
            return [submissionHeader, 'See quiz below']
        }
        case 'online_upload': {
            const attachment = submission.attachments?.[0]
            const submissionBody = attachment
                ? createLinkNormal(attachment.display_name, attachment.url)
                : 'No upload'
            return [submissionHeader, submissionBody]
        }
        case 'online_url': {
            return [submissionHeader, submission.url ?? 'No URL']
        }
        case 'student_annotation': {
            return [
                submissionHeader,
                'This submission type is not currently handled.',
            ]
        }
        case 'media_recording': {
            let submissionBody
            const media_comment = submission.media_comment
            if (!media_comment) {
                submissionBody = 'No media'
            } else {
                if (media_comment?.display_name) {
                    submissionBody = createLinkNormal(
                        media_comment.display_name ?? 'Link to media',
                        media_comment.url
                    )
                } else {
                    submissionBody = media_comment.url
                }
            }
            return [submissionHeader, submissionBody]
        }
        default: {
            return [
                submissionHeader,
                `Submission type '${submission.submission_type}' unsupported.`,
            ]
        }
    }
}

function assembleFeedbackInfo(submission: Submission) {
    const feedbackHeader = convertToHeader('Feedback', 2)
    const feedbackBody = submission?.submission_comments?.length
        ? createList(
              submission?.submission_comments.map(
                  (comment) => `${comment.author_name}: ${comment.comment}`
              ),
              '-'
          )
        : 'No feedback'
    return [feedbackHeader, feedbackBody]
}

function assembleRubricInfo(assignment: Assignment, submission: Submission) {
    const rubricHeader = convertToHeader('Rubric', 2)
    const rubric = assignment.rubric
    const rubricTableHeader = rubric
        ? createTableHeader(['Criteria', 'Score', 'Comments'])
        : null
    const assessment = submission.rubric_assessment
    const rows = rubric?.map((criterion) => {
        const description = criterion.description
        const points = criterion.points
        const comments = assessment ? assessment[criterion.id]?.comments : ''
        const score = assessment ? assessment[criterion.id]?.points : ''
        return [description, `${score}/${points}`, comments]
    })
    const rubricTableBody = rows ? createTableRows(rows) : ''
    const rubricTable = !rubricTableHeader
        ? 'No rubric'
        : rubricTableHeader + rubricTableBody

    return [rubricHeader, rubricTable]
}
