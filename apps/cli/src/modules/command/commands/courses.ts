import { getCourses, getAssignments } from '@modules/canvas_api/api'
import { Command } from '../types/command'
import { state } from '../state'
import { checkbox } from '@inquirer/prompts'
import { Course } from '@modules/canvas_api/types/course'

export const coursesCommand = {
    name: 'courses',
    description: 'Prints all courses',
    run: select_courses,
    category: 'general',
} satisfies Command

export async function select_courses() {
    state.courses = undefined

    const unfilteredCourses = await getCourses()

    const courses: Course[] = []
    for (const c of unfilteredCourses) {
        const assignments = await getAssignments(c.id)
        console.log(assignments)
        if (assignments.length > 0) {
            courses.push(c)
        }
    }

    if (courses.length === 0) {
        console.log('No courses found')
        return
    }

    const answer = await checkbox({
        message: 'What courses should be used?',
        choices: courses.map((c) => {
            return { name: c.name, value: c.id }
        }),
    })
    state.courses = courses.filter((c) => answer.includes(c.id))
}
