import { generate, median } from "../generate";
import * as generateFunctions from "../generate";
import { testCourses, testAssignments, testSubmissions } from "./data";
import { state } from "@modules/command/state";

jest.mock("@modules/canvas_api/api", () => ({
  getSubmissions: jest.fn().mockReturnValue(() => []),
}));

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
    const genAssignment = jest.spyOn(generateFunctions, "genAssignment").mockImplementation();

    await generate();

    expect(genAssignment).toHaveBeenCalledTimes(testAssignments.length);
  });
});

describe("median", () => {
  it("should be a valid median function", () => {
    expect(median([1])).toBe(1);
    expect(median([1, 2])).toBe(2);
    expect(median([1, 2, 3])).toBe(2);
  });
});

describe("getHighMedLow", () => {
  it("should return high, median, and low", () => {
    const submissions = testSubmissions;
    const { high, med, low } = generateFunctions.getHighMedLow(submissions);
    expect(high).toEqual(testSubmissions[2]);
    expect(med).toEqual(testSubmissions[1]);
    expect(low).toEqual(testSubmissions[0]);
  });

  it("should return high and median", () => {
    const submissions = [testSubmissions[0], testSubmissions[1]];
    const { high, med, low } = generateFunctions.getHighMedLow(submissions);
    expect(high).toEqual(testSubmissions[1]);
    expect(med).toEqual(testSubmissions[0]);
    expect(low).toBeNull();
  });

  it("should return high", () => {
    const submissions = [testSubmissions[0]];
    const { high, med, low } = generateFunctions.getHighMedLow(submissions);
    expect(high).toEqual(testSubmissions[0]);
    expect(med).toBeNull();
    expect(low).toBeNull();
  });
});
