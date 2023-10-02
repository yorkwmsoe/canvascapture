import { getSubmissions } from "@modules/canvas_api/api";
import { Command } from "../types/command";
import { state } from "../state";

export const generateCommand = {
  name: "generate",
  description: "Generate PDF",
  run: generate,
  category: "general",
} satisfies Command;

// https://stackoverflow.com/a/70806192
const median = (arr: number[]): number | undefined => {
  if (!arr.length) return undefined;
  const s = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 === 0 ? ((s[mid - 1] + s[mid]) / 2) : s[mid];
};

async function generate() {
  if (state.courses && state.courses.length > 0) {
    for (const course of state.courses) {
      console.log(course.name);
      console.log(course.start_at + "-" + course.end_at);
      const filteredAssignments = state.assignments?.filter(a => a.course_id === course.id);
      if (filteredAssignments && filteredAssignments.length > 0) {
        for (const assignment of filteredAssignments) {
          console.log(assignment.name);
          const submissions = await getSubmissions(course.id, assignment.id);
          const filteredScores = submissions.filter(a => a.score !== undefined && a.score !== null).map(b => b.score ?? -1)
          const maxGrade = Math.max(...filteredScores);
          const medianGrade = median(filteredScores);
          const minGrade = Math.max(...filteredScores);
          if (submissions.length >= 3 || submissions.length === 2) {
            //const total = assignment.points_possible;
            const max = submissions.filter(s => s.score === maxGrade);
            console.log(max[0].score + "/" + assignment.points_possible);
            console.log(max[0].body);
          }
          if (submissions.length >= 3 || submissions.length === 1) {
            const med = submissions.filter(s => s.score === medianGrade);
            console.log(med[0].score + "/" + assignment.points_possible);
            console.log(med[0].body);
          }
          if (submissions.length >= 3 || submissions.length === 2) {
            const min = submissions.filter(s => s.score === minGrade);
            console.log(min[0].score + "/" + assignment.points_possible);
            console.log(min[0].body);
          }
        }
      }
    }
  }
}