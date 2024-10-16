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

        const tocEntry = `<li class="toc-${level}"><a href="#${anchorId}">${text}</a></li>`
        tocEntries.push(tocEntry)
    })

    const tocHTML = `
    <div class="toc">
      <h2>Table of Contents</h2>
      <ul>
        ${tocEntries.join('')}
      </ul>
    </div>
  `
    return tocHTML
}
