import { Course } from "../canvas_api/types/course";
import { Assignment } from "../canvas_api/types/assignment";

export type State = {
    courses?: Course[];
    selected_course_ids?: number[];
    assignments: Map<number, Assignment[]>;
    selected_assignment_ids?: Map<number, number[]>;
}

export let state: State = {
    courses: undefined,
    selected_course_ids: undefined,
    assignments: new Map(),
    selected_assignment_ids: new Map(),
};