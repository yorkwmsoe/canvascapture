import { rm, writeFile } from 'fs/promises'
import markdownit from 'markdown-it'
import _ from 'lodash'
import { mkdirSync } from 'fs'
import { join } from 'path'
import { Assignment, Course, Quiz, Submission } from '@canvas-capture/lib'
import { canvasApi } from '../../apis/canvas.api'
import { getCourseName } from '@renderer/utils/courses'
import { sanitizePath } from '@renderer/utils/sanitize-path'
import { FilePathContentPair } from './types'
import { generateAssignmentOrQuiz, median } from './utils'
import { oneYearExport, avgCourseGradeExport } from '../Statistics'
import { Chart, LinearScale, CategoryScale, LineController, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(
    LinearScale, // for the y-axis scale
    CategoryScale, // for the x-axis scale
    LineController, // for creating line charts
    LineElement, // for line elements in the chart
    PointElement, // for point elements in the chart
    Title, // for chart titles
    Tooltip, // for tooltips
    Legend // for the chart legend
);

export const generatePairs = async (
    course: Course,
    assignment: Assignment,
    submissions: Submission[],
    quiz: Quiz | undefined,
    assignmentsPath: string,
    canvasAccessToken: string,
    canvasDomain: string
): Promise<FilePathContentPair[]> => {
    const highSubmission =
        _.maxBy(submissions, (s) => s.score) ?? submissions[0]
    const highPair = {
        filePath: join(assignmentsPath, 'high'),
        content: (
            await generateAssignmentOrQuiz(
                course,
                assignment,
                highSubmission,
                quiz,
                canvasAccessToken,
                canvasDomain
            )
        ).join('\n'),
    }

    const medianSubmission =
        submissions.filter(
            (s) => s.score === median(submissions.map((x) => x.score))
        )[0] ?? submissions[0]
    const medianPair = {
        filePath: join(assignmentsPath, 'median'),
        content: (
            await generateAssignmentOrQuiz(
                course,
                assignment,
                medianSubmission,
                quiz,
                canvasAccessToken,
                canvasDomain
            )
        ).join('\n'),
    }

    const lowSubmission = _.minBy(submissions, (s) => s.score) ?? submissions[0]
    const lowPair = {
        filePath: join(assignmentsPath, 'low'),
        content: (
            await generateAssignmentOrQuiz(
                course,
                assignment,
                lowSubmission,
                quiz,
                canvasAccessToken,
                canvasDomain
            )
        ).join('\n'),
    }

    switch (submissions.length) {
        case 1:
            return [highPair]
        case 2:
            return [highPair, lowPair]
        default:
            return [highPair, medianPair, lowPair]
    }
}

export async function generate(
    courses: Course[],
    assignments: Assignment[],
    canvasAccessToken: string,
    canvasDomain: string,
    isStudent: boolean,
    generationName: string,
    documentsPath: string
) {
    await rm(join(documentsPath, sanitizePath(generationName)), {
        recursive: true,
        force: true,
    })

    const md = markdownit({ linkify: true, html: true })

    // Object to hold combined markdown content for each course
    const courseMarkdownContent: { [courseId: string]: string } = {}

    for (const course of courses) {
        const filteredAssignments = assignments.filter(
            (a) => a.course_id === course.id
        )
        let courseContent = `# ${getCourseName(course)}\n\n` // Start course-level markdown content with a title
        const coursePath = sanitizePath(
            join(generationName, getCourseName(course))
        )
        mkdirSync(join(documentsPath, coursePath), { recursive: true })

        for (const assignment of filteredAssignments) {
            const submissions = await canvasApi.getSubmissions({
                canvasAccessToken,
                canvasDomain,
                isStudent,
                courseId: course.id,
                assignmentId: assignment.id,
            })

            const uniqueSubmissions = _.uniqBy(
                submissions.filter((s) => !_.isNil(s.score)),
                (s) => s.score
            )

            if (uniqueSubmissions.length > 0) {
                courseContent += `## ${assignment.name}\n\n` // Assignment title
                const quiz = assignment.is_quiz_assignment
                    ? await canvasApi.getQuiz({
                          canvasAccessToken,
                          canvasDomain,
                          courseId: assignment.course_id,
                          quizId: assignment.quiz_id,
                      })
                    : undefined

                const pairs = await generatePairs(
                    course,
                    assignment,
                    uniqueSubmissions,
                    quiz,
                    sanitizePath(join(generationName, getCourseName(course))),
                    canvasAccessToken,
                    canvasDomain
                )

                pairs.forEach((pair) => {
                    courseContent += `${pair.content}\n\n` // Append assignment content
                })
            }
        }

        // Store the combined content for this course
        courseMarkdownContent[course.name] = courseContent
    }
    const meta = document.createElement("meta")
    meta.httpEquiv="Content-Security-Policy"
    meta.content="img-src 'self' data:;"

    let oneYearStat;
    let avgCourseGrade = ''
    if (oneYearExport()) {
     oneYearStat = await generateChart()
    }
    if (avgCourseGradeExport()) {
        avgCourseGrade = 'Avg Course Grade'
    }

    // Write markdown and generate HTML for each course
    const htmlData: FilePathContentPair[] = Object.keys(
        courseMarkdownContent
    ).map((courseName) => {
        const markdownContent =
            courseMarkdownContent[courseName]
        const filePath = join(
            documentsPath,
            generationName,
            courseName,
            `${courseName}.md`
        )

        // Write the markdown file for the course
        writeFile(filePath, markdownContent)

        // Convert markdown to HTML
        const htmlContent = md.render(markdownContent)
        console.log(htmlContent);

        let htmlContentEditable = htmlContent;

        console.log("New HTML\n"+htmlContentEditable);
        if(oneYearStat!=undefined){
            htmlContentEditable+=oneYearStat;
        }

        return {
            filePath: `${courseName}`,
            content: htmlContentEditable,//I can just add html to this and it will print to the file.
        }
    })

    return htmlData
}

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}


async function generateChart() {
    let oneYearStat2;
    const ctx = document.createElement("canvas");
    ctx.width = 200;
    ctx.height = 200;

    // Append the canvas to the body (or another DOM element) temporarily
    document.body.appendChild(ctx);

    return new Promise((resolve) => {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'],
                datasets: [{
                    label: 'Days to Grade',
                    data: [3, 2, 5, 1, 2, 7, 10, 12, 5, 3, 2, 3, 1, 3],
                    borderWidth: 1,
                    pointBackgroundColor: 'cyan',
                    borderColor: '#008b8b'
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                animation: {
                    onComplete: function() {
                        // Now that the chart is rendered, capture the canvas as an image
                        const imgData = ctx.toDataURL();

                        const wrap = document.createElement('div');
                        const img = document.createElement('img');
                        img.src = imgData;  // Set the base64 image as the source of the img element
                        img.width=800;
                        img.height=800;
                        console.log("toDataUrl = " + imgData);
                        console.log("height: " + ctx.height + " Width: " + ctx.width);
                        wrap.appendChild(img);

                        oneYearStat2 = wrap.innerHTML;
                        console.log("OneYearStat:\n" + oneYearStat2);

                        // Remove the canvas from the DOM after capturing the image
                        document.body.removeChild(ctx);

                        resolve(oneYearStat2);  // Resolve the promise with the image HTML
                    }
                }
            }
        });
    });
}

