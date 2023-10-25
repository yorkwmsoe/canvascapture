import { Course } from "../canvas_api/types/course";
import { Assignment } from "../canvas_api/types/assignment";
import { Settings, defaultSettings } from "@constants/settings";

export type State = {
  courses?: Course[];
  assignments?: Assignment[];
  settings: Settings;
};

export const state: State = {
  courses: undefined,
  assignments: undefined,
  settings: defaultSettings,
};
