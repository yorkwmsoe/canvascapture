import { getAssignments, getSubmissions } from '@modules/canvas_api/api.js'
import { Command } from '../types/command.js'
import { state } from '@modules/command/state.js'
import { checkbox } from '@inquirer/prompts'
import { Assignment } from '@modules/canvas_api/types/assignment.js'

export const assignmentsCommand = {
    name: 'assignments',
    description: 'Select assignments to use',
    run: select_assignments,
    category: 'general',
} satisfies Command

export async function select_assignments() {
    state.assignments = []
    if (!state.courses || state.courses.length === 0) {
        console.log('No courses selected')
        return
    }

    for (const course of state.courses) {
        const unfilteredAssignments = await getAssignments(course.id)

        const assignments: Assignment[] = []
        for (const a of unfilteredAssignments) {
            const submissions = await getSubmissions(course.id, a.id)
            if (submissions.filter((s) => s.workflow_state !== 'unsubmitted').length > 0) {
                assignments.push(a)
            }
        }

        if (assignments.length === 0) {
            console.log('No assignments found')
            return
        }

        const answer = await checkbox({
            message: `What assignments from ${course.name} should be used?`,
            choices: assignments.map((a) => {
                return { name: a.name, value: a.id }
            }),
        })
        state.assignments = state.assignments.concat(assignments.filter((a) => answer.includes(a.id)))
    }
}
