import { Assignment } from '@renderer/types/canvas_api/assignment'
import { Course } from '@renderer/types/canvas_api/course'
import { Submission } from '@renderer/types/canvas_api/submission'
import { generateAssignment } from '@renderer/utils/markdown/generators'
import { rm } from 'fs/promises'
import { getSubmissions } from '@renderer/apis/canvas.api'
import { useSettingsStore } from '@renderer/stores/settings.store'

// https://stackoverflow.com/a/70806192
export const median = (arr: number[]): number => {
  const s = [...arr].sort((a, b) => a - b)
  const mid = Math.floor(s.length / 2)
  const res = s.length % 2 === 0 ? (s[mid - 1] + s[mid]) / 2 : s[mid]
  return Math.ceil(res)
}

export const genAssignment = async (course: Course, assignment: Assignment, canvasAccessToken: string, canvasDomain: string) => {
  //console.log(`\tGenerating ${assignment.name}`)
  const submissions = await getSubmissions({
    canvasAccessToken,
    canvasDomain,
    courseId: course.id,
    assignmentId: assignment.id
  })
  const filteredScores = submissions
    .filter((a) => a.score !== null && a.score !== undefined)
    .map((b) => b.score)
  if (filteredScores.length > 0) {
    const { high, med, low } = getHighMedLow(submissions)
    if (high) {
      //console.log(`\t\tGenerating high`)
      await generateAssignment(course, assignment, high, 'high')
    }
    if (med) {
      //console.log(`\t\tGenerating median`)
      await generateAssignment(course, assignment, med, 'median')
    }
    if (low) {
      //console.log(`\t\tGenerating low`)
      await generateAssignment(course, assignment, low, 'low')
    }
  } else {
    //console.log('\t\tNo submissions for assignment')
  }
}

export async function generate(courses: Course[] | undefined, assignments: Assignment[], canvasAccessToken: string, canvasDomain: string) {
  if (courses && courses.length > 0) {
    for (const course of courses) {
      await rm('output', { recursive: true, force: true })
      //console.log(`Generating ${course.name}`)
      const filteredAssignments = assignments?.filter((a) => a.course_id === course.id)
      if (filteredAssignments && filteredAssignments.length > 0) {
        for (const assignment of filteredAssignments) {
          await genAssignment(course, assignment, canvasAccessToken, canvasDomain)
        }
      } else {
        //console.log('No assignments selected')
      }
    }
  } else {
    //console.log('No courses selected')
  }
}

export function getHighMedLow(submissions: Submission[]) {
  const copySubmissions = [...submissions]
  let high: Submission | null | undefined = null
  let med: Submission | null | undefined = null
  let low: Submission | null | undefined = null

  high = chooseSubmission(
    copySubmissions,
    copySubmissions.filter((s) => s.score === Math.max(...getScores(copySubmissions)))[0]
  )

  if (copySubmissions.length >= 1) {
    med = chooseSubmission(
      copySubmissions,
      copySubmissions.filter((s) => s.score === median(getScores(copySubmissions)))[0]
    )
  }

  if (copySubmissions.length >= 1) {
    low = chooseSubmission(
      copySubmissions,
      copySubmissions.filter((s) => s.score === Math.min(...getScores(copySubmissions)))[0]
    )
  }

  return { high, med, low }
}

function getScores(submissions: Submission[]) {
  return submissions.filter((a) => a.score !== null && a.score !== undefined).map((b) => b.score)
}

function chooseSubmission(submissions: Submission[], submission?: Submission) {
  const index = submissions.findIndex((item) => item.id === submission?.id)

  if (index > -1) {
    submissions.splice(index, 1)
  }

  return submission
}
