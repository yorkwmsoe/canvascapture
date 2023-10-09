import { genSubmission } from '../generate';
import { testAssignments, testSubmissions } from './data';


describe("generate submission", () => {
  it("should generate a submission", () => {
    const log = jest.spyOn(console, "log").mockImplementation();
    
    genSubmission(testAssignments[0], testSubmissions, testSubmissions[0].score ?? 0);

    expect(log).toHaveBeenCalledWith(testSubmissions[0].score + "/" + testAssignments[0].points_possible);
    expect(log).toHaveBeenCalledWith(testSubmissions[0].body);
  });
});