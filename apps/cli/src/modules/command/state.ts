import { Course } from "../canvas_api/types/course";
import { Assignment } from "../canvas_api/types/assignment";

export type State = {
    courses?: Course[];
    assignments?: Assignment[];
}

export const state: State = {
    courses: undefined,
    assignments: undefined,
};