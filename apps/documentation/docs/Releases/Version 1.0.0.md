First release of the CLI and Desktop applications. Released in Spring 2025.

### Features
#### CLI
- Commands
  - help - display help information
  - version - display the current version of the CLI
  - exit - exit the CLI
  - settings - display/edit the current settings
  - setup - setup the CLI for first time use
  - greet - greet the user (for testing args)
  - courses - list all courses & select them
  - assignments - list all assignments & select them
  - generate - generate pdfs/markdown files

#### Desktop
- Pages
  - Home - displays the home page with the version, settings, generation input and all previous generations
  - Settings/Setup - displays the settings page with the current settings and allows the user to edit them
  - Generation - displays the generation page & allows the user to generate pdfs/markdown files
    - Select Courses - displays all courses and allows the user to select them
    - Select Assignments - displays all assignments and allows the user to select them
    - (Optional) Markdown Editor - allows the user to edit the markdown files before generation
    - Generate - generates the pdfs/markdown files
