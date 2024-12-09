import puppeteer from 'puppeteer'

export async function getComments(
    domain: string,
    course: number,
    quiz_id: number,
    quiz_submission_id: number,
    username: string,
    password: string
): Promise<string[]> {
    // Launch the browser
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    //login

    await page.goto(`${domain}login`) //http://sdlstudentvm09.msoe.edu/login
    await page.type('#pseudonym_session_unique_id', username) //canvas-student1
    await page.type('#pseudonym_session_password', password) //studentofcanvas1
    await page.click('input[type="submit"]')
    await page.waitForNavigation()

    // Navigate to the quiz history page
    await page.goto(
        `${domain}courses/${course}/quizzes/${quiz_id}/history?quiz_submission_id=${quiz_submission_id}`,
        {
            waitUntil: 'domcontentloaded', // Ensure the DOM is loaded before scraping
        }
    )

    await page.waitForSelector('body') // This waits until the <body> element is loaded
    let html = await page.content() // Retrieve the full HTML content of the page

    // Output the HTML
    //console.log(html);
    let additionalComments = []
    const regex = /<div class="quiz_comment">([\s\S]*?)<\/div>/g
    let match

    while ((match = regex.exec(html)) !== null) {
        additionalComments.push(match[1].trim())
    }

    // Close the browser
    await browser.close()
    return additionalComments
}
