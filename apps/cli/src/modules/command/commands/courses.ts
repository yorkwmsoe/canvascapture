import { getCourses } from "@modules/canvas_api/api";
import { Command } from "../types/command";
import inquirer from "inquirer";

export const coursesCommand = {
  name: "courses",
  description: "Prints all courses",
  run: courses,
  category: "general",
} satisfies Command;

async function courses() {
  const courses = (await getCourses());
  await inquirer
    .prompt([{
      type: 'checkbox',
      name: 'Course Selection',
      message: 'What courses should be used?',
      choices: courses.map((c) => c.name),
    }])
    .then((answers) => {
      console.log(answers);
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        // Something else went wrong
      }
    });
}