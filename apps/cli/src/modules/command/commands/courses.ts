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
  state.courses = (await getCourses());
  const answers: {courses: number[]} = await inquirer.prompt([{
      type: 'checkbox',
      name: coursesCommand.name,
      message: 'What courses should be used?',
      choices: state.courses.map((c) => {return {name: c.name, value: c.id}}),
  }]);
  state.selected_course_ids = answers.courses;
}