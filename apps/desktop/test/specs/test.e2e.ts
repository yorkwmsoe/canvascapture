import { browser } from '@wdio/globals'
import { Key } from 'webdriverio'

describe('End-to-end test', () => {
    it('should reach the settings page if a generation name is entered', async () => {
        // --Setup page--
        // Clear the default domain input
        const canvasDomainInput = await $('input#basic_canvasDomain')
        await canvasDomainInput.waitUntil(
            async () => {
                return (await canvasDomainInput.getValue()).length > 0
            },
            { timeout: 10000 }
        )
        await canvasDomainInput.click()
        await browser.keys([Key.Ctrl, 'a'])
        await browser.keys([Key.Backspace])

        // Set the values and save
        const accessTokenInput = await $('input#basic_canvasAccessToken')
        await canvasDomainInput.setValue('http://sdlstudentvm06.msoe.edu')
        await accessTokenInput.setValue(
            'reK0qt1RHGt1tCVrNwrNasbWnOd8T52y2vW4BV3yM1mXZ9jtLAXU6Xn2mtzcNZ3B'
        )
        const saveButton = await $('button[type=submit]')
        await saveButton.click()

        // --Home page--
        // Set the generation name
        const generationNameInput = await $('#generationNameInput')
        await generationNameInput.waitForExist({ timeout: 10000 })
        await generationNameInput.setValue('IntegrationTestGeneration')

        // Start the generation
        const generationNameButton = await $('#generationNameButton')
        await generationNameButton.waitForExist({ timeout: 10000 })
        await generationNameButton.click()

        // --Course selection--
        // Select the first course
        const courseCheckboxes = await $('//span[text() = "Test Course 1"]')
        await courseCheckboxes.waitForExist({ timeout: 1000 })
        await courseCheckboxes.click()

        // Hit the next button
        const nextButton = await $('#nextButton')
        await nextButton.click()

        // --Assignment Selection--
        // Select the assignments in the first course
        const assignmentCheckboxes = await $('//span[text() = "Test Course 1"]')
        await assignmentCheckboxes.waitForExist({ timeout: 1000 })
        await assignmentCheckboxes.click()

        await nextButton.click()

        // --Generation page--
        // Wait for generation to finish, and to be redirected to the home page
        await generationNameInput.waitForExist({ timeout: 10000 })
    })
})
