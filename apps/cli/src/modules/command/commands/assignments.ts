import { getAssignments } from "@modules/canvas_api/api";
import { Command } from "../types/command";
import { state } from "@modules/command/state";
import { checkbox } from "@inquirer/prompts";

export const assignmentsCommand = {
  name: "assignments",
  description: "Select assignments to use",
  run: select_assignments,
  category: "general",
} satisfies Command;

export async function select_assignments() {
  if (state.courses && state.courses.length > 0) {
    for (const course of state.courses) {
      const assignments = (await getAssignments(course.id));
      const answer = await checkbox({
        message: `What assignments from ${course.name} should be used?`,
        choices: assignments.map((a) => {return {name: a.name, value: a.id}}),
      });
      state.assignments = assignments.filter((a) => answer.includes(a.id));
    }
  } else {
    console.log("No courses selected");
  }
}