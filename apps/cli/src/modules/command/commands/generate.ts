import { getSubmissions } from "@modules/canvas_api/api";
import { Command } from "../types/command";
import { state } from "../state";

export const generateCommand = {
  name: "generate",
  description: "Generate PDF",
  run: generate,
  category: "general",
} satisfies Command;

async function generate() {
  if (state.courses && state.courses.length > 0) {
      for (const course of state.courses) {
        const filteredAssignments = state.assignments?.filter(a => a.course_id === course.id);
        if (filteredAssignments && filteredAssignments.length > 0) {
            for (const assignment of filteredAssignments) {
                const submissions = await getSubmissions(course.id, assignment.id);
            }
        }
      }
      /*const answers: {courses: number[]} = await inquirer.prompt([{
          type: 'checkbox',
          name: generateCommand.name,
          message: 'What courses should be used?',
          choices: state.courses.map((c) => {return {name: c.name, value: c.id}}),
      }]);*/
  }
}