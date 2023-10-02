import axios from "axios";
import { Assignment } from "./types/assignment";
import { Course } from "./types/course";
import { Submission } from "./types/submission";

const api = axios.create({
  baseURL: process.env.CANVAS_DOMAIN + "/api/v1",
  headers: {'Authorization': `Bearer ${process.env.CANVAS_ACCESS_TOKEN}`}
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