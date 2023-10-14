import { Assignment } from "@modules/canvas_api/types/assignment";
import { Course } from "@modules/canvas_api/types/course";
import { Submission } from "@modules/canvas_api/types/submission";
import { mkdir, rm } from "fs/promises";
import { addNewLine, convertToHeader, createList, createTableHeader, createTableRows, writeToFile } from "./markdown";
import { existsSync } from "fs";

const basePath = "./output";

export async function cleanOutput(path: string) {
  if (existsSync(path)) {
    await rm(path);
  }
}

export async function generateAssignmentFolder(course: Course, assignment: Assignment) {
  const folderName = `${assignment.name}`;
  const path = `${basePath}/${course.name}/${folderName}`;
  await cleanOutput(path);
  await mkdir(path, { recursive: true });
  return folderName;
}

export async function generateAssignment(course: Course, assignment: Assignment, submission: Submission, score: "high" | "median" | "low") {
  const fileName = `${score}.md`;
  const title = convertToHeader(assignment.name, 1);
  const grade = `${submission.score}/${assignment.points_possible}`;
  const descriptionHeader = convertToHeader("Description", 2);
  const description = assignment.description;
  const submissionHeader = convertToHeader("Submission", 2);
  const submissionBody = submission.body;
  const feedbackHeader = convertToHeader("Feedback", 2);
  const feedbackBody = !!submission?.submission_comments?.length
    ? createList(
        submission?.submission_comments.map((comment) => comment.comment),
        "-"
      )
    : "No feedback";
  const rubricHeader = convertToHeader("Rubric", 2);
  const rubric = assignment.rubric;
  const rubricTableHeader = !!rubric ? createTableHeader(["Criteria", "Score", "Comments"]) : null;
  const assessment = submission.rubric_assessment;
  const rows = rubric?.map((criterion) => {
    const description = criterion.description;
    const points = criterion.points;
    const comments = assessment ? assessment[criterion.id]?.comments : "";
    const score = assessment ? assessment[criterion.id]?.points : "";
    return [description, `${score}/${points}`, comments];
  });
  const rubricTableBody = !!rows ? createTableRows(rows) : "";
  const rubricTable = !rubricTableHeader ? "No rubric" : rubricTableHeader + rubricTableBody;

  const items = [title, grade, descriptionHeader, description, submissionHeader, submissionBody, feedbackHeader, feedbackBody, rubricHeader, rubricTable];

  const generate = async () => {
    const folderName = await generateAssignmentFolder(course, assignment);
    items.forEach((item) => {
      const filePath = `${basePath}/${course.name}/${folderName}/${fileName}`;
      writeToFile(filePath, item);
      addNewLine(filePath);
    });
  };

  return {
    items,
    generate,
  };
}
