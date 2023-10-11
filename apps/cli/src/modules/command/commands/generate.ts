import { getSubmissions } from "@modules/canvas_api/api";
import { Command } from "../types/command";
import { state } from "../state";
import { Submission } from "@modules/canvas_api/types/submission";
import { Assignment } from "@modules/canvas_api/types/assignment";
import { Course } from "@modules/canvas_api/types/course";

export const generateCommand = {
  name: "generate",
  description: "Generate PDF",
  run: generate,
  category: "general",
} satisfies Command;

// https://stackoverflow.com/a/70806192
export const median = (arr: number[]): number => {
  const s = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 === 0 ? ((s[mid - 1] + s[mid]) / 2) : s[mid];
};

export const genAssignment = async (course: Course, assignment: Assignment) => {
  console.log(assignment.name);
  const submissions = await getSubmissions(course.id, assignment.id);
  const filteredScores = submissions.filter(a => a.score !== undefined && a.score !== null).map(b => b.score)
  if (filteredScores.length > 0) {
    if (submissions.length >= 3 || submissions.length === 2) {
      genSubmission(assignment, submissions, Math.max(...filteredScores));
    }
    if (submissions.length >= 3 || submissions.length === 1) {
      genSubmission(assignment, submissions, median(filteredScores));
    }
    if (submissions.length >= 3 || submissions.length === 2) {
      genSubmission(assignment, submissions, Math.min(...filteredScores));
    }
  } else {
    console.log("No submissions for assignment");
  }
}

export const genSubmission = (assignment: Assignment, submissions: Submission[], score: number) => {
  const submission = (submissions.filter(s => s.score === score))[0];
  console.log(submission.score + "/" + assignment.points_possible);
  console.log(submission.body);
}

export async function generate() {
  if (state.courses && state.courses.length > 0) {
    for (const course of state.courses) {
      console.log(course.name);
      console.log(course.start_at + "-" + course.end_at);
      const filteredAssignments = state.assignments?.filter(a => a.course_id === course.id);
      if (filteredAssignments && filteredAssignments.length > 0) {
        for (const assignment of filteredAssignments) {
          await genAssignment(course, assignment);
        }
      } else {
        console.log("No assignments selected");
      }
    }
  } else {
    console.log("No courses selected");
  }
}