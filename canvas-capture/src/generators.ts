/**
 * Defines methods for generating assignments and quizzes, as
 * well as related helper functions
 *
 * See individual definitions below for more details
 */
import { Assignment } from './entity/assignment'
import { RubricAssessmentCriterion, Submission } from './entity/submission'
import { Quiz } from './entity/quiz'
import { QuizSubmission } from './entity/quiz-submissions'
import {
    convertToHeader,
    createLinkNormal,
    createList,
    createTableHeader,
    createTableRows,
} from './markdown'
import { getDescriptionFromClassroomInvite } from '../../apps/desktop/src/renderer/src/apis/GitHub.api'
export async function generateAssignmentDescription(
    assignment: Assignment,
    fancy: boolean
) {
    const title = convertToHeader('ASSIGNMENT: ' + assignment.name, 1)
    const descriptionInfo = await assembleDescriptionInfo(assignment, fancy)

    const items = [title, ...descriptionInfo]

    return items.filter((item) => !!item)
}

export function generateAssignmentSubmission(
    assignment: Assignment,
    submission: Submission,
    fancy: boolean
) {
    const items = [
        ...assembleTitleAndGrade(assignment, submission, 'SUBMISSION: '),
        ...assembleFeedbackInfo(submission),
        ...assembleRubricInfo(assignment, submission),
        ...assembleSubmissionInfo(submission, fancy),
    ]

    return items.filter((item) => !!item)
}

export async function generateQuiz(
    assignment: Assignment,
    submission: Submission,
    quiz: Quiz,
    quizSubmission: QuizSubmission | undefined,
    quizQuestionInfo: string[],
    fancy: boolean
) {
    const descriptionInfo = await assembleDescriptionInfo(assignment, fancy)
    const items = [
        ...assembleTitleAndGrade(assignment, submission, 'QUIZ: '),
        ...descriptionInfo,
        ...assembleFeedbackInfo(submission),
        ...quizOverview(assignment, quiz),
        ...quizUserOverview(submission, quizSubmission),
        ...quizQuestionInfo,
    ]
    return items.filter((item) => !!item)
}

export async function generateQuizDescription(
    assignment: Assignment,
    quiz: Quiz,
    quizQuestionInfo: string[],
    fancy: boolean
) {
    const title = convertToHeader('QUIZ: ' + assignment.name, 1)
    const descriptionInfo = await assembleDescriptionInfo(assignment, fancy)
    const items = [
        title,
        ...descriptionInfo,
        ...quizOverview(assignment, quiz),
        ...quizQuestionInfo,
    ]
    return items.filter((item) => !!item)
}

export function generateQuizSubmission(
    assignment: Assignment,
    submission: Submission,
    quizSubmission: QuizSubmission | undefined,
    quizQuestionInfo: string[]
) {
    const items = [
        ...assembleTitleAndGrade(assignment, submission, 'SUBMISSION: '),
        ...assembleFeedbackInfo(submission),
        ...quizUserOverview(submission, quizSubmission),
        ...quizQuestionInfo,
    ]
    return items.filter((item) => !!item)
}

function wrapUserContent(userContent: string, fancy: boolean) {
    return fancy
        ? `\n<div style="border: solid lightgray; border-radius: 15px; padding: 5px;">\n${userContent}\n</div>\n`
        : `\n<code>\n${userContent}\n</code>\n`
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

async function assembleDescriptionInfo(assignment: Assignment, fancy: boolean) {
    if (!assignment.description || assignment.description.trim() === '') {
        // If there's no description, return an empty array (i.e., nothing will be added)
        return []
    }

    let chasedLink: string = ''

    //Descriptions start with a canvas link, so skip that one first.
    let workableDescription: string = assignment.description.substring(
        assignment.description.indexOf('>' + 1)
    )
    workableDescription = workableDescription.substring(
        workableDescription.indexOf('>') + 1
    )
    if (workableDescription.includes('href')) {
        //Check if description is or starts with a link.
        let urlStart: string = workableDescription.substring(
            workableDescription.indexOf('href')
        )
        urlStart = urlStart.substring(urlStart.indexOf('"') + 1)
        const url: string = urlStart.substring(0, urlStart.indexOf('"'))

        console.log('URL: ' + url)
        chasedLink = ' THIS IS A LINK'

        chasedLink = await getDescriptionFromClassroomInvite(url)
    }

    //check if it's a link to github, chase the link if so
    //run pnpm package everytime you update this file or another inside this folder.
    const descriptionHeader = convertToHeader('Description', 2)
    const description =
        wrapUserContent(assignment.description, fancy) + chasedLink

    return [descriptionHeader, description]
}

function assembleSubmissionInfo(submission: Submission, fancy: boolean) {
    if (!submission.submission_type) {
        // If there's no submission type, return an empty array (exclude submission section)
        return []
    }

    const submissionHeader = convertToHeader('Submission', 2)

    switch (submission.submission_type) {
        case 'online_text_entry': {
            if (!submission.body) {
                // If there's no body, return an empty array
                return []
            }
            const submissionBody = wrapUserContent(submission.body, fancy)
            return [submissionHeader, submissionBody]
        }
        case 'online_quiz': {
            return [submissionHeader, 'See quiz below']
        }
        case 'online_upload': {
            const attachment = submission.attachments?.[0]

            if (!attachment) {
                // If no attachment is found, return an empty array
                return []
            }

            const submissionBody = createLinkNormal(
                attachment.display_name,
                attachment.url
            )
            return [submissionHeader, submissionBody]
        }
        case 'online_url': {
            if (!submission.url) {
                // If there's no URL, return an empty array
                return []
            }
            return [submissionHeader, submission.url]
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
            if (!media_comment || !media_comment.url) {
                return []
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
    const feedbackComments = submission?.submission_comments?.map(
        (comment) => `${comment.author_name}: ${comment.comment}`
    )

    if (!feedbackComments || feedbackComments.length === 0) {
        // If there are no feedback comments, return an empty array (exclude feedback section)
        return []
    }

    const feedbackHeader = convertToHeader('Feedback', 2)
    const feedbackBody = createList(feedbackComments, '-')

    return [feedbackHeader, feedbackBody]
}

function assembleRubricInfo(assignment: Assignment, submission: Submission) {
    const rubricHeader = convertToHeader('Rubric', 2)
    const rubric = assignment.rubric
    if (!rubric || rubric.length === 0) {
        // If there's no rubric, return an empty array (exclude rubric section)
        return []
    }
    const rubricTableHeader = createTableHeader([
        'Criteria',
        'Score',
        'Comments',
    ])

    const assessment = submission.rubric_assessment
    const rows = rubric?.map((criterion) => {
        const assessment_criterion = assessment?.find((ac: RubricAssessmentCriterion) => {
            return ac.rubricCriteria.id === criterion.id;
        });

        const description = criterion.description
        const points = criterion.points
        const comments = assessment_criterion ? assessment_criterion?.comments : ''
        const score = assessment_criterion ? assessment_criterion?.points : ''
        return [description, `${score}/${points}`, comments]
    })
    const rubricTableBody = createTableRows(rows)
    const rubricTable = rubricTableHeader + rubricTableBody

    return [rubricHeader, rubricTable]
}
