export const checkbox = jest.fn();
export const getCourses = jest.fn();
export const getAssignments = jest.fn();
export const getSubmissions = jest.fn();

jest.mock("@inquirer/prompts", () => ({
  checkbox: checkbox
}));

jest.mock('@modules/canvas_api/api', () => ({
  getCourses: getCourses,
  getAssignments: getAssignments,
  getSubmissions: getSubmissions,
}));