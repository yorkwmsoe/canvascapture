import { getSubmissions } from './mocks'
import * as generateFunctions from '../generate';
import { genAssignment } from '../generate';
import { testCourses, testAssignments, testSubmissions } from './data';


describe("generate assignment", () => {
  const genSub = jest.spyOn(generateFunctions, "genSubmission").mockImplementation();
  const log = jest.spyOn(console, "log").mockImplementation();

  afterEach(() => {
    genSub.mockReset();
    log.mockReset();
  });

  it("should log no submission for assignment", async () => {
    getSubmissions.mockReturnValue(Promise.resolve([]));

    await genAssignment(testCourses[0], testAssignments[0]);

    expect(log).toHaveBeenCalledWith(testAssignments[0].name);
    expect(log).toHaveBeenCalledWith("No submissions for assignment");
  });

  it("should generate for submissions length === 1", async () => {
    getSubmissions.mockReturnValue(Promise.resolve(testSubmissions.slice(0, 1)));

    await genAssignment(testCourses[0], testAssignments[0]);

    expect(log).toHaveBeenCalledWith(testAssignments[0].name);
    expect(genSub).toHaveBeenCalledTimes(1);
  });

  it("should generate for submissions length === 2", async () => {
    getSubmissions.mockReturnValue(Promise.resolve(testSubmissions.slice(0, 2)));

    await genAssignment(testCourses[0], testAssignments[0]);

    expect(log).toHaveBeenCalledWith(testAssignments[0].name);
    expect(genSub).toHaveBeenCalledTimes(2);
  });

  it("should generate for submissions length >= 3", async () => {
    getSubmissions.mockReturnValue(Promise.resolve(testSubmissions.slice(0, 3)));

    await genAssignment(testCourses[0], testAssignments[0]);

    expect(log).toHaveBeenCalledWith(testAssignments[0].name);
    expect(genSub).toHaveBeenCalledTimes(3);
  });
});