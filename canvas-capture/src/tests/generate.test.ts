/**
 * This file contains tests related to generate()
 */

import { test } from 'vitest'
import { insertJumpLinks } from '../../../apps/desktop/src/renderer/src/components/Generate/generate'

/**
 * Represents a test case for validating the insertion of Jump Link sections.
 *
 * @property name - A brief description of the test case, explaining the scenario being tested.
 * @property html - The input HTML structure for the test case.
 * @property expected - A mapping where they keys are 'id' values of 'data-node-content' divs in the input HTML,
 *                      and the values are the expected 'data-sections' attributes for the Jump Link sections that
 *                      corresponding to each 'data-node-content' div.
 */
type InsertJumpLinksCase = {
    name: string
    html: string
    expected: Record<string, string>
}

const insertJumpLinksCases: InsertJumpLinksCase[] = [
    {
        name: 'two complete groups, each div has a header',
        html: `
            <!-- group 4‑15 -->
            <div class="data-node-content" id="4-15-description">
                <h2>Description</h2><p>...</p>
            </div>
            <div class="data-node-content" id="4-15-low">
                <h3>Low Submission</h3><p>...</p>
            </div>
            <div class="data-node-content" id="4-15-median">
                <h2>Median Submission</h2>
            </div>
            <div class="data-node-content" id="4-15-high">
                <h2>High Submission</h2>
            </div>

            <!-- group 7‑3 -->
            <div class="data-node-content" id="7-3-description">
                <h1>Description</h1>
            </div>
            <div class="data-node-content" id="7-3-high">
                <h4>High Submission</h4>
            </div>
        `,
        expected: {
            // group 4-15
            '4-15-description': 'description,low,median,high',
            '4-15-low': 'description,low,median,high',
            '4-15-median': 'description,low,median,high',
            '4-15-high': 'description,low,median,high',

            // group 7-3
            '7-3-description': 'description,high',
            '7-3-high': 'description,high',
        },
    },

    {
        name: 'mixed headers, some subsections lack any heading',
        html: `
            <!-- group 'first-group' -->
            <div class="data-node-content" id="first-group-description">
                <h2>Description</h2>
            </div>
            <div class="data-node-content" id="first-group-low">
                <p>No header here</p>
            </div>

            <!-- group 'othergroup' -->
            <div class="data-node-content" id="othergroup-median">
                <p>No header either</p>
            </div>
            <div class="data-node-content" id="othergroup-high">
                <h3>High</h3>
            </div>
        `,
        expected: {
            // group 'first-group'
            'first-group-description': 'description,low,median,high',
            'first-group-low': 'description,low,median,high',
            'first-group-median': 'description,low,median,high',
            'first-group-high': 'description,low,median,high',

            // group 'othergroup'
            'othergroup-description': 'description,high',
            'othergroup-high': 'description,high',
        },
    },
]

test.each(insertJumpLinksCases)(
    'Jump Link Section Placement Test: $name',
    ({ html, expected }) => {
        // Generate function's output and parse it into a Document object.
        // The output is converted to a Document object in order to "normalize" it.
        const output = insertJumpLinks(html)
        const doc = new DOMParser().parseFromString(output, 'text/html')

        // For each div of class 'data-node-content', verify the creation and placement of a Jump Links section.
        doc.querySelectorAll('.data-node-content').forEach((div) => {
            // Select all matching Jump Links elements in the current div
            const jumps = div.querySelectorAll('.data-node-content-jumplinks')

            // Verify that exactly one Jump Links section exists
            if (jumps.length === 0) {
                throw new Error(
                    `Expected exactly one Jump Links section to be created, but none were found.`
                )
            } else if (jumps.length > 1) {
                throw new Error(
                    `Expected exactly one Jump Links section, but found ${jumps.length} sections.`
                )
            }

            // If exactly one Jump Links section is present, continue
            const jump = jumps[0]

            // Verify the placement of the Jump Links section.
            const firstHeader = div.querySelector('h1,h2,h3,h4,h5,h6')
            const expectedPlace = firstHeader
                ? firstHeader.nextElementSibling
                : div.firstElementChild
            if (!jump.isEqualNode(expectedPlace)) {
                if (firstHeader === null) {
                    throw new Error(
                        `Expected first child to be Jump Links section, but a different element was found instead.`
                    )
                } else {
                    throw new Error(
                        `Expected Jump Links section to be placed after first header, but a different element was found instead.`
                    )
                }
            }

            // Verify that the Jump Links section has a correctly labeled 'data-sections' attribute.
            const expectedDataSections = expected[div.id]
            if (expectedDataSections === undefined) {
                throw new Error(
                    `An expected data-sections attribute is not set for ${div.id}. Verify test correctness and that function is not modifying 'data-node-content' div ids.`
                )
            }
            if (jump.getAttribute('data-sections') !== expectedDataSections) {
                throw new Error(
                    `Expected data-sections attribute to be set to ${expectedDataSections}, but it was set to ${jump.getAttribute('data-sections')}.`
                )
            }

            // Verify that the Jump Links section contains links to such sections.
            const group = div.id.substring(0, div.id.indexOf('-')) // find group name
            const expectedHrefs: string[] = [] // determine expected hrefs
            if (expectedDataSections.includes('description')) {
                expectedHrefs.push(`#${group}-description`)
            }
            if (expectedDataSections.includes('low')) {
                expectedHrefs.push(`#${group}-low`)
            }
            if (expectedDataSections.includes('median')) {
                expectedHrefs.push(`#${group}-median`)
            }
            if (expectedDataSections.includes('high')) {
                expectedHrefs.push(`#${group}-high`)
            }
            const hrefs = Array.from(
                // find actual hrefs
                jump.querySelectorAll('a'),
                (a) => a.getAttribute('href')
            )
            for (const href of expectedHrefs) {
                // verify
                if (!hrefs.includes(href)) {
                    throw new Error(
                        `Expected Jump Links section to contain a link to ${href}, but it was not found.`
                    )
                }
            }
        })
    }
)
