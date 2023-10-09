import { checkbox, getCourses } from './mocks'
import { select_courses } from '../courses';
import { testCourses } from './data';
import { state } from '@modules/command/state'

describe("courses", () => {
  it("should return a course", async () => {
    checkbox.mockReturnValue([testCourses[0].id]);
    getCourses.mockReturnValue(Promise.resolve(testCourses));

    await select_courses();

    expect(state.courses).toMatchObject(testCourses);
  });
});
