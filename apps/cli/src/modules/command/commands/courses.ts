import { getCourses } from "@modules/canvas_api/api";
import { Command } from "../types/command";
import { state } from "../state";
import inquirer from "inquirer";

export const coursesCommand = {
  name: "courses",
  description: "Prints all courses",
  run: select_courses,
  category: "general",
} satisfies Command;

async function select_courses() {
  const courses = (await getCourses());
  const answers: {courses: number[]} = await inquirer.prompt([{
      type: 'checkbox',
      name: coursesCommand.name,
      message: 'What courses should be used?',
      choices: courses.map((c) => {return {name: c.name, value: c.id}}),
  }]);
  state.courses = courses.filter((c) => answers.courses.includes(c.id));
}