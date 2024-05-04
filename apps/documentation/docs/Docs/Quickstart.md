### Install

from the root directory not `apps/docs`

```bash
$ pnpm i
```

### build
    
```bash
$ pnpm documentation build
```

### Development

```bash
$ pnpm documentation start
```

### Code Changes 
Using hot reloading the website refreshes the files that were changes and shows the changes in real time.

### Create a Document 
Documents are groups of pages connected through:
- a sidebar
- previous/next navigation
- versioning

#### Creating Document Example
Create a Markdown file at docs/hello.md:

```markdown
# Hello

This is my **first Docusaurus document**!

```

#### Configure the Sidebar 

Docusaurus automatically creates a sidebar from the docs folder.
Add metadata to customize the sidebar label and position:


```bash
---
sidebar_label: 'Hi!'
sidebar_position: 3
---
```
```markdown

# Hello

This is my **first Docusaurus document**!

```


It is also possible to create your sidebar explicitly in the sidebar.js file.

```bash
export default {
  tutorialSidebar: [
    'intro',
    'hello',
    {
      type: 'category',
      label: 'Tutorial',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
};
```

## Project Structure Diagram

The project structure diagram is a [plantuml work breakdown structure](https://plantuml.com/wbs-diagram), and was created in VS Code with the official plantuml extension.