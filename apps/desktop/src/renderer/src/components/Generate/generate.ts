import { Assignment } from '@renderer/types/canvas_api/assignment'
import { Course } from '@renderer/types/canvas_api/course'
import { Submission } from '@renderer/types/canvas_api/submission'
import { rm, writeFile } from 'fs/promises'
import { getSubmissions } from '@renderer/apis/canvas.api'
import _ from 'lodash'
import { ipcRenderer } from 'electron'
import { generateAssignment } from '@renderer/utils/markdown/generators'
import markdownit from 'markdown-it'
import { getDocumentsPath } from '@renderer/utils/config'

// https://stackoverflow.com/a/70806192
export const median = (arr: number[]): number => {
  const s = arr.toSorted((a, b) => a - b)
  const mid = Math.floor(s.length / 2)
  const res = s.length % 2 === 0 ? (s[mid - 1] + s[mid]) / 2 : s[mid]
  return Math.ceil(res)
}

function getScores(submissions: Submission[]) {
  return submissions.filter((a) => _.isObject(a)).map((b) => b.score)
}

type SubmissionWithScore = {
  submission: Submission
  score: 'high' | 'median' | 'low'
}

type FilePathContentPair = {
  filePath: string
  pseudoFile: string
}

export const genAssignment = async (
  course: Course,
  assignment: Assignment,
  submissions: Submission[],
  outpath: string
) => {
  if (getScores(submissions).length === 0) return

  const copySubmissions = [...submissions]
  const selectedSubmissions: SubmissionWithScore[] = [
    { submission: chooseSubmission(copySubmissions, (s) => Math.max(...s)), score: 'high' },
    { submission: chooseSubmission(copySubmissions, (s) => median(s)), score: 'median' },
    { submission: chooseSubmission(copySubmissions, (s) => Math.min(...s)), score: 'low' }
  ]

  const pairs: FilePathContentPair[] = []

  for (const ss of selectedSubmissions) {
    const pair = await generateAssignment(course, assignment, ss.submission, ss.score, outpath)
    if (pair !== null) {
      pairs.push(pair)
    }
  }
  return pairs
}

export async function generate(
  courses: Course[],
  assignments: Assignment[],
  canvasAccessToken: string,
  canvasDomain: string,
  outpath: string
) {
  await rm(outpath, { recursive: true, force: true })
  const pairsArr: FilePathContentPair[] = []
  for (const course of courses) {
    const filteredAssignments = assignments.filter((a) => a.course_id === course.id)
    for (const assignment of filteredAssignments) {
      const submissions = await getSubmissions({
        canvasAccessToken,
        canvasDomain,
        courseId: course.id,
        assignmentId: assignment.id
      })
      const pairArr = await genAssignment(course, assignment, submissions, outpath)
      if (pairArr !== undefined) {
        pairsArr.push(...pairArr)
      }
    }
  }
  pairsArr.forEach((x) => writeFile(x.filePath + '.md', x.pseudoFile))

  const md = markdownit({
    linkify: true
  })

  const htmlData: FilePathContentPair[] = pairsArr.map((x) => {
    return {
      filePath: x.filePath.replace(getDocumentsPath(), '/files'),
      pseudoFile: md.render(x.pseudoFile)
    }
  })
  //htmlData.forEach((x) => console.log(x.pseudoFile))

  ipcRenderer.send('generate', htmlData)
}

function chooseSubmission(submissions: Submission[], filterFunc: (s: number[]) => number) {
  const submission = submissions.filter((s) => s.score === filterFunc(getScores(submissions)))[0]
  const index = submissions.findIndex((item) => item.id === submission?.id)

  // side effect: remove if found
  if (index > -1) {
    submissions.splice(index, 1)
  }

  return submission
}
