import { generateAssignment } from "../generators";
import { testAssignments, testCourses, testSubmissions } from "@modules/command/commands/tests/data";
import * as markdown from "../markdown";

describe("generateAssignment", () => {
  it("should generate a items for markdown", async () => {
    const result = await generateAssignment(testCourses[0], testAssignments[0], testSubmissions[0], "high", false);
    expect(result.items.length).toBeGreaterThan(0);
  });

  it("should generate all headers", async () => {
    const result = await generateAssignment(testCourses[0], testAssignments[0], testSubmissions[0], "high", false);
    expect(result.items[0]).toBeDefined();
    expect(result.items[2]).toBeDefined();
    expect(result.items[4]).toBeDefined();
    expect(result.items[6]).toBeDefined();
    expect(result.items[8]).toBeDefined();
  });

  it("should generate all bodies", async () => {
    const result = await generateAssignment(testCourses[0], testAssignments[0], testSubmissions[0], "high", false);
    expect(result.items[1]).toBeDefined();
    expect(result.items[3]).toBeDefined();
    expect(result.items[5]).toBeDefined();
    expect(result.items[7]).toBeDefined();
    expect(result.items[9]).toBeDefined();
  });

  it("should generate a table", async () => {
    testAssignments[0].rubric = [
      {
        id: "1",
        points: 10,
        description: "Test criterion 1",
        long_description: "Test criterion 1",
        criterion_use_range: false,
        ignore_for_scoring: false,
        ratings: [],
      },
    ];
    const result = await generateAssignment(testCourses[0], testAssignments[0], testSubmissions[0], "high", false);
    expect(result.items[9]).toContain("|");
  });

  it("should handle online_quiz", async () => {
    testSubmissions[0].submission_type = "online_quiz";
    const result = await generateAssignment(testCourses[0], testAssignments[0], testSubmissions[0], "high", false);
    expect(result.items[5]).toBe("No submission");
  });

  it("should generate a list", async () => {
    testSubmissions[0].submission_comments = [
      {
        comment: "Test comment 1",
        author: {
          id: 1,
          short_name: "Test User 1",
          html_url: "https://test.instructure.com/courses/1/users/1",
        },
        author_name: "Test User 1",
        author_id: 1,
        created_at: new Date(),
        id: 1,
        edited_at: new Date(),
        media_comment: {
          "content-type": "video/mp4",
          media_type: "video/mp4",
          display_name: "Test Video 1",
          media_id: "1",
          url: "https://test.instructure.com/courses/1/files/1/download?download_frd=1&verifier=1",
        },
      },
    ];
    const result = await generateAssignment(testCourses[0], testAssignments[0], testSubmissions[0], "high", false);
    expect(result.items[7]).toContain("-");
  });

  it("should write to file", async () => {
    const writeToFile = jest.spyOn(markdown, "writeToFile").mockImplementation();
    const addNewLine = jest.spyOn(markdown, "writeToFile").mockImplementation();
    const result = await generateAssignment(testCourses[0], testAssignments[0], testSubmissions[0], "high");

    expect(writeToFile).toHaveBeenCalled();
    expect(addNewLine).toHaveBeenCalled();
    expect(result.items.length).toBeGreaterThan(0);
  });

  it("should have no description", async () => {
    testAssignments[0].description = "";
    const result = await generateAssignment(testCourses[0], testAssignments[0], testSubmissions[0], "high", false);
    expect(result.items[3]).toBe("No description");
  });

  it("should have a decsription", async () => {
    testAssignments[0].description = "Test description";
    const result = await generateAssignment(testCourses[0], testAssignments[0], testSubmissions[0], "high", false);
    expect(result.items[3]).toBe("Test description");
  });
});
