import { getSubmissions } from "@modules/canvas_api/api";
import { Command } from "../types/command";
import { state } from "../state";
import { Assignment } from "@modules/canvas_api/types/assignment";
import { Course } from "@modules/canvas_api/types/course";
import { cleanOutput, generateAssignment } from "@modules/markdown/generators";

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
  return s.length % 2 === 0 ? (s[mid - 1] + s[mid]) / 2 : s[mid];
};

export const genAssignment = async (course: Course, assignment: Assignment) => {
  console.log(`\tGenerating ${assignment.name}`);
  const submissions = await getSubmissions(course.id, assignment.id);
  const filteredScores = submissions.filter((a) => a.score !== undefined && a.score !== null).map((b) => b.score);
  if (filteredScores.length > 0) {
    if (submissions.length >= 3 || submissions.length === 2) {
      console.log(`\t\tGenerating high`);
      (await generateAssignment(course, assignment, submissions.filter((s) => s.score === Math.max(...filteredScores))[0], "high")).generate();
    }
    if (submissions.length >= 3 || submissions.length === 1) {
      console.log(`\t\tGenerating median`);
      (await generateAssignment(course, assignment, submissions.filter((s) => s.score === median(filteredScores))[0], "median")).generate();
    }
    if (submissions.length >= 3 || submissions.length === 2) {
      console.log(`\t\tGenerating low`);
      (await generateAssignment(course, assignment, submissions.filter((s) => s.score === Math.min(...filteredScores))[0], "low")).generate();
    }
  } else {
    console.log("\t\tNo submissions for assignment");
  }
};

export async function generate() {
  if (state.courses && state.courses.length > 0) {
    for (const course of state.courses) {
      console.log(`Generating ${course.name}`);
      const filteredAssignments = state.assignments?.filter((a) => a.course_id === course.id);
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
