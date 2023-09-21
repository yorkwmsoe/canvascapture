import { Assignment } from "./types/assignment";
import { Course } from "./types/course";
import { Submission } from "./types/submission";

const apiRequest = async (route: string): Promise<any> => {
  const resp = await fetch(process.env.CANVAS_DOMAIN + "/api/v1" + route, {
	method: 'GET',
	headers: { Authorization: `Bearer ${process.env.CANVAS_ACCESS_TOKEN}` }
  });
  return await resp.json();
}

export const getCourses = async (): Promise<Course[]> => {
  return await apiRequest("/courses?exclude_blueprint_courses");
}

export const getAssignments = async (course_id: number): Promise<Assignment[]> => {
  return await apiRequest(`/courses/${course_id}/assignments`);
}

export const getSubmissions = async (course_id: number, assignment_id: number): Promise<Submission[]> => {
  return await apiRequest(`/courses/${course_id}/assignments/${assignment_id}/submissions`);
}