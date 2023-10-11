import axios from "axios";
import { Assignment } from "./types/assignment";
import { Course } from "./types/course";
import { Submission } from "./types/submission";
import { parseISO } from "date-fns";

// date handling from: https://stackoverflow.com/a/66238542
export function handleDates(body: any) {
  if (body === null || body === undefined || typeof body !== "object")
    return body;

  for (const key of Object.keys(body)) {
    const value = body[key];
    if (value && typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(value)) {
      body[key] = parseISO(value);
    }
    else if (typeof value === "object") handleDates(value);
  }
}

const api = axios.create({
  baseURL: process.env.CANVAS_DOMAIN + "/api/v1",
  headers: {'Authorization': `Bearer ${process.env.CANVAS_ACCESS_TOKEN}`}
});

api.interceptors.response.use(originalResponse => {
  handleDates(originalResponse.data);
  return originalResponse;
});

export const getCourses = async (): Promise<Course[]> => {
  return (await api.get(`/courses?exclude_blueprint_courses`)).data;
}

export const getAssignments = async (course_id: number): Promise<Assignment[]> => {
  return (await api.get(`/courses/${course_id}/assignments`)).data;
}

export const getSubmissions = async (course_id: number, assignment_id: number): Promise<Submission[]> => {
  return (await api.get(`/courses/${course_id}/assignments/${assignment_id}/submissions?include[]=rubric_assessment&submission_comments`)).data;
}