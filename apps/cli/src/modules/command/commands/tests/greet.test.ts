import { greet } from "../greet";

describe("greet", () => {
  test("should return a greeting", () => {
    const log = jest.spyOn(console, "log").mockImplementation();
    greet({
      name: "World",
    });
    expect(log).toHaveBeenCalledWith("Hello World");
  });

  test("should throw an error if no name is provided", () => {
    expect(() => greet({ name: "" })).toThrowError();
  });
});
