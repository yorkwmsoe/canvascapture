import { Command } from '../types/command'
import { state } from '../state'
import { checkbox } from '@inquirer/prompts'
import { Course } from '@canvas-capture/lib'
import { canvasApi } from '@/lib/canvas.api'

export const coursesCommand = {
    name: 'courses',
    description: 'Prints all courses',
    run: select_courses,
    category: 'general',
} satisfies Command

export async function select_courses() {
    state.courses = undefined

    const unfilteredCourses = await canvasApi.getCourses({
        canvasAccessToken: state.config.canvasApiToken,
        canvasDomain: state.config.canvasDomain,
    })

    const courses: Course[] = []
    for (const c of unfilteredCourses) {
        const assignments = await canvasApi.getAssignments({
            canvasAccessToken: state.config.canvasApiToken,
            canvasDomain: state.config.canvasDomain,
            courseId: c.id,
        })
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
