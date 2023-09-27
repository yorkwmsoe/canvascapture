import { getAssignments } from "@modules/canvas_api/api";
import { Command } from "../types/command";
import { state } from "../state";
import inquirer from "inquirer";

export const assignmentsCommand = {
  name: "assignments",
  description: "Select assignments to use",
  run: select_assignments,
  category: "general",
} satisfies Command;

async function select_assignments() {
  const filteredCourses = state.courses?.filter((c) => state.selected_course_ids?.includes(c.id));
  if (filteredCourses && filteredCourses.length > 0) {
    state.selected_assignment_ids = new Map();
    for (const course of filteredCourses) {
      const assignment = (await getAssignments(course.id));
      state.assignments.set(course.id, assignment);
      const answers: {assignments: number[]} = await inquirer.prompt([{
          type: 'checkbox',
          name: assignmentsCommand.name,
          message: `What assignments from ${course.name} should be used?`,
          choices: assignment.map((c) => {return {name: c.name, value: c.id}}),
      }]);
      state.selected_assignment_ids.set(course.id, answers.assignments);
    }
  } else {
    console.log("No courses selected");
  }
}