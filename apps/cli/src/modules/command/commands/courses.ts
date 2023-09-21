import { getCourses } from "@modules/canvas_api/api";
import { Command } from "../types/command";

export const coursesCommand = {
  name: "courses",
  description: "Prints all courses",
  run: courses,
  category: "general",
} satisfies Command;

async function courses() {
    for (const course of (await getCourses())) {
        console.log(course.name);
    }
}