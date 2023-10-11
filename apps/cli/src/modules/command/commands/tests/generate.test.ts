import { generate, median } from '../generate';
import * as generateFunctions from '../generate';
import { testCourses, testAssignments } from './data';
import { state } from '@modules/command/state'

describe("generate", () => {
  it("should log no courses selected", async () => {
    state.courses = [];
    const log = jest.spyOn(console, "log");

    await generate();

    expect(log).toHaveBeenCalledWith("No courses selected");
  });
  it("should log no assignments selected", async () => {
    state.courses = testCourses;
    state.assignments = [];
    const log = jest.spyOn(console, "log");

    await generate();

    expect(log).toHaveBeenCalledWith("No assignments selected");
  });
  it("should generate an assignment", async () => {
    state.courses = testCourses;
    state.assignments = testAssignments;
    const log = jest.spyOn(console, "log");
    const genAssignment = jest.spyOn(generateFunctions, "genAssignment").mockImplementation();

    await generate();

    expect(genAssignment).toHaveBeenCalledTimes(testAssignments.length);
  });
});

describe("median", () => {
  it("should be a valid median function", () => {
    expect(median([1])).toBe(1);
    expect(median([1, 2])).toBe(1.5);
    expect(median([1, 2, 3])).toBe(2);
  });
})