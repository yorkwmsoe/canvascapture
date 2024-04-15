## Test Case Name: Select Course
- Test Case ID: CLI_TC_001
- Test Priority: High
- Test Objective: To verify that a user can successfully select a course from the command-line interface.

Preconditions:

The command-line interface is accessible.
The list of available courses is displayed on the command-line interface.
Connected to the Canvas API.

Test Steps:

1. Launch the command-line interface.
2. View the list of available courses displayed on the screen.
3. Enter the command to select a course (e.g., select-course [course_code]) and press Enter.
4. Verify that the selected course is displayed on the screen.
5. Verify that the command-line interface prompts the user for further actions related to the selected course (e.g., start the course, view course details, etc.).

Expected Result:

The selected course is displayed on the screen.
The command-line interface prompts the user for further actions related to the selected course.
Postconditions:

The selected course is ready for further interactions (e.g., starting the course, viewing course details, etc.).