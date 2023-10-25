import { getCourses } from '@modules/canvas_api/api'
import { Command } from '../types/command'
import { state } from '../state'
import { checkbox } from '@inquirer/prompts'

export const coursesCommand = {
    name: 'courses',
    description: 'Prints all courses',
    run: select_courses,
    category: 'general',
} satisfies Command

export async function select_courses() {
    const courses = await getCourses()
    const answer = await checkbox({
        message: 'What courses should be used?',
        choices: courses.map((c) => {
            return { name: c.name, value: c.id }
        }),
    })
    state.courses = courses.filter((c) => answer.includes(c.id))
}
