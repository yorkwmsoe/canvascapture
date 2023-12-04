import type { Assignment } from '$lib/types/assignment'
import type { Course } from '$lib/types/course'
import type { Submission } from '$lib/types/submission'
import { parseISO } from 'date-fns'
import type {FetchOptions} from "@tauri-apps/api/http"
import {fetch} from "@tauri-apps/api/http"

//date handling from: https://stackoverflow.com/a/66238542
export function handleDates(body: any) {
    if (body === null || body === undefined || typeof body !== 'object') return body

    for (const key of Object.keys(body)) {
        const value = body[key]
        if (value && typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(value)) {
            body[key] = parseISO(value)
        } else if (typeof value === 'object') handleDates(value)
    }
}

export const getApiHeaders = (token: string, headers?: FetchOptions) => {
    return {
        ...headers,
        Authorization: `Bearer ${token}`,
    }
}

export const getCourses = async (domain: string, token: string): Promise<Course[]> => {
    return (await fetch<Course[]>(`${domain}/courses?exclude_blueprint_courses`, {method: "GET", headers: getApiHeaders(token) })).data
}

export const getAssignments = async (domain: string, token: string, course_id: number): Promise<Assignment[]> => {
    return (await fetch<Assignment[]>(`${domain}/courses/${course_id}/assignments`, {method: "GET", headers: getApiHeaders(token) })).data
}

export const getSubmissions = async (domain: string, token: string, course_id: number, assignment_id: number): Promise<Submission[]> => {
    return (await fetch<Submission[]>(`${domain}/courses/${course_id}/assignments/${assignment_id}/submissions?include[]=rubric_assessment&include[]=submission_comments`, {method: "GET", headers: getApiHeaders(token) })).data
}
