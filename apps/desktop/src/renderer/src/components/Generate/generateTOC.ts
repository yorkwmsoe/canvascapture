export function generateTOC(htmlContent: string) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlContent, 'text/html')

    const headings = doc.querySelectorAll('h1, h2')
    const tocEntries: string[] = []

    headings.forEach((heading, index) => {
        const level = heading.tagName.toLowerCase()
        const text = heading.textContent || ''
        const anchorId = `toc-${index}`
        heading.id = anchorId

      let tocEntry = ''
      if (['Submission', 'Rubric', 'Feedback', 'Description'].includes(text)) {
        tocEntry = `<li class="toc-${level}" style="list-style-type: '-';"><a href="#${anchorId}">${text}</a></li>`
      } else {
        tocEntry = `<li class="toc-${level}" style="padding-top: 5px;"><a href="#${anchorId}">${text}</a></li>`
      }

        tocEntries.push(tocEntry)
    })

    const tocHTML = `
    <div class="toc" style="text-align: center;">
      <h2>Table of Contents</h2>
      <ul style="list-style-position: inside; list-style-type: none; padding-left: 0;">
        ${tocEntries.join('')}
      </ul>
    </div>
  `
    return tocHTML
}
