This package primarily serves to facilitate fetching data from Canvas and formatting it for use.

## Installation

Follow the instructions on the [Getting Started Quickstart page](/sdl/sdl/canvascapture/docs/Getting%20Started/Quickstart) (if you haven't already done so).

## Building

If a change is made to this module, it will need to be rebuilt in order for the change to registered. To register this, run:
```bash
pnpm package
```

## Developing

```bash
pnpm @canvas-capture package --watch
```

## Testing

```bash
pnpm @canvas-capture test
```

## Markdown Module
When this project was in the very early stages of development, there were some concerns about existing npm packages and their capabilities when outputting markdown. There was not a library that would perform all the desired capabilities of this project. Therefore, a custom markdown library was built.

This markdown module has the ability to output:
 + Variable sizes headings
 + Underline, Bold, or Italicize certain words given an input text
 + Lists using certain symbols
 + Links
 + Images
 + Text with newlines appended
 + Inline code
 + Block code
 + Table Header
 + Table Body (Rows)

## Canvas API
In order to grab information from Canvas, the [Canvas LMS API](https://canvas.instructure.com/doc/api/) is used for the vast majority of all data retrievals. These methods to retrieve the data are found within this module. This module has the ability to:
+ (handleDates) Change dates from string format to Date object
+ (intercept) Perform handleDates on [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response/Response) objects
+ (getApiHeaders) Get the neccesary headers. This is often the Auth Bearer token
+ (getCourses) Retrieve desired courses
+ (getAssignments) Retrieve Desired Assignments
+ (getAssignmentsWithCourseId) Retrieve Assignments given a course id
+ (getSubmissions) Retrieve Submissions
+ (getQuiz) Retrieve a Quiz
+ (getQuizSubmission) Retrieve all Submissions on a Quiz
+ (getLatestQuizVersion) Gets latest quiz version
+ (getMostCommonQuizVersion) Gets most common quiz version
+ (getQuizSubmissionQuestions) Gets all questions associated with a quiz submission
+ (getQuizQuestionsNoParams) Gets quiz questions with no parameters in URL
+ (getQuizQuestionsParams) Gets all quiz questions with parameters in URL

## Generators
This is the module responsible for outputting all the desired data into markdown format. It utilizes the methods from the markdown module and the input data provided to it in order to accomplish this. In the end, it will return list of strings.

## Quiz Organization
This module groups much of the laborious quiz implementation. It is responsible for getting data on a quiz's individual question
























