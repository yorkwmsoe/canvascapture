import {
    convertToHeader,
    performSpecialWordOperation,
    createTableHeader,
    createTableRows,
    createList,
    createLink,
    generateIMG,
    createInlineCode,
    createCodeBlock,
    addNewLine,
} from '../markdown'
import { readFileSync, writeFileSync } from 'fs'
import { describe, test, expect, beforeAll } from 'vitest'

type headerSizes = {
    size: number,
    output: string
}
describe('markdown convertToHeader', () => {
    //Arrange
    const sampleHeader = "SampleHeader"
    const listOfHeaderSizes: headerSizes[] = [
        {size: 1, output: "# SampleHeader",},
        {size: 2, output: "## SampleHeader"},
        {size: 3, output: "### SampleHeader"},
        {size: 4, output: "#### SampleHeader"},
        {size: 5, output: "##### SampleHeader"},
        {size: 6, output: "###### SampleHeader"}]
    //Act and Assert
    test.each(listOfHeaderSizes)('convertToHeader is same as SampleHeader', (head) => {
        const retrievedHeader = convertToHeader(sampleHeader, head.size)
        expect(retrievedHeader).toBe(head.output)
    })
})

describe('Create list', () => {
    type ListCheck = {
        bullet: string,
        output: string
    }
    const correctLists: ListCheck[] = [
        {bullet: "- [ ]", output: "- [ ] one\n- [ ] two\n- [ ] three\n"},
        {bullet: "*", output: "* one\n* two\n* three\n"},
        {bullet: "+", output: "+ one\n+ two\n+ three\n"},
        {bullet: "-", output: "- one\n- two\n- three\n"},

    ]
    test.each(correctLists)('Testing lists', (listCheck) => {
        const checkList: string = createList(['one', 'two', 'three'], listCheck.bullet)
        expect(checkList).toBe(listCheck.output)
    })
})

describe('Testing createlink', () => {
    const ikeaLink = createLink(
        'This Link to Ikea',
        'Link',
        'https://ikea.com'
    )

    test('createlink', () => {
        const testLink = "This [Link](https://ikea.com) to Ikea"
        expect(ikeaLink).toBe(testLink)
    })
})

describe('Test Markdown Code', () => {
    const inlineCode = '`' + "Sample Inline Code" + '`'
    test('Inline Code', () => {
        expect(createInlineCode("Sample Inline Code"), inlineCode)
    })

    const multiLineCode = '\n```\n' + "Sample Multi-Line Code" + '\n```\n'
    test('Multi line Code', () => {
        expect(createInlineCode("Sample Multi-Line Code"), multiLineCode)
    })
})

describe('Test Table Header', () => {
    const tableHeader = "| head1 | head2 | head3 |\n| --- | --- | --- |\n"
    test('Table Header ', () => {
        const returnedTableHeader = createTableHeader(["head1", "head2", "head3"])
        console.log(returnedTableHeader)
        console.log(tableHeader)
        expect(returnedTableHeader).toBe(tableHeader)
    })
})

describe("Test Create Table Rows", () => {
    const tableRows = "| r1c1 | r1c2 | r1c3 |\n| r2c1 | r2c2 | r2c3 |\n"
    const tableRowsToPass = [['r1c1', 'r1c2', 'r1c3'], ['r2c1', 'r2c2', 'r2c3']]

    test("Table Rows Correctness", () => {
        expect(createTableRows(tableRowsToPass)).toBe(tableRows)
    })
})

describe('markdown output test', () => {
    //Arrange

    //Directory of tests to append for file location
    const testDir = './src/tests/'
    //Path of testing file
    const filePath = testDir + 'sample'

    //Create all headers
    const header1: string = convertToHeader('Help Me', 1)
    const header2: string = convertToHeader('Help Me', 2)
    const header3: string = convertToHeader('Help Me', 3)
    const header4: string = convertToHeader('Help Me', 4)
    const header5: string = convertToHeader('Help Me', 5)
    const header6: string = convertToHeader('Help Me', 6)

    //Create simple phrase and perform multiple special word operations on it.
    let phrase =
        'The banana crossed the road and decided to eat some banana because the banana wanted to try banana'
    phrase = performSpecialWordOperation(phrase, 'banana', 'bold', [1, 3])
    phrase = performSpecialWordOperation(phrase, 'banana', 'strike', [2, 4])
    phrase = performSpecialWordOperation(phrase, 'the', 'strike', [1, 2])

    //Create Table
    const head: string = createTableHeader(['Cars', 'Sports'])
    const rows: string = createTableRows([
        ['Honda', 'hockey'],
        ['Ford', 'baseball'],
    ])

    //Create all Lists
    const simpList = '## Simple List'
    const checkList: string = createList(['one', 'two', 'three'], '- [ ]')
    const astList: string = createList(['one', 'two', 'three'], '*')
    const plusList: string = createList(['one', 'two', 'three'], '+')
    const dashList: string = createList(['one', 'two', 'three'], '-')

    //Create Link and Image
    const ikeaLink = createLink(
        'Here is the Link to Ikea',
        'Link',
        'https://ikea.com'
    )
    const image = generateIMG(testDir + 'testIMG/Luh-Calm-Fit.png')

    //Create coding syntax
    const inline: string = createInlineCode('HELP MEEEEE')
    const block: string = createCodeBlock('HELP MEEEEE')

    beforeAll(() => {
        let mdString = ''

        //Add all headers
        mdString += header1
        mdString = addNewLine(mdString)
        mdString += header2
        mdString = addNewLine(mdString)
        mdString += header3
        mdString = addNewLine(mdString)
        mdString += header4
        mdString = addNewLine(mdString)
        mdString += header5
        mdString = addNewLine(mdString)
        mdString += header6
        mdString = addNewLine(mdString)

        //Append phrase to string
        mdString += phrase
        mdString = addNewLine(mdString)

        //Append Table to string
        mdString += head
        mdString += rows
        mdString = addNewLine(mdString)

        //Append all lists to string
        mdString += simpList + ' Check'
        mdString = addNewLine(mdString)
        mdString += checkList
        mdString += simpList + ' Asterisk'
        mdString = addNewLine(mdString)
        mdString += astList
        mdString += simpList + ' Plus'
        mdString = addNewLine(mdString)
        mdString += plusList
        mdString += simpList + ' Dash'
        mdString = addNewLine(mdString)
        mdString += dashList
        mdString = addNewLine(mdString)

        //Append link and image to string
        mdString += ikeaLink
        mdString = addNewLine(mdString)
        mdString += image
        mdString = addNewLine(mdString)
        mdString += inline
        mdString += block

        //Write result to file
        writeFileSync(filePath + '.md', mdString)
    })

    test('that the generated markdown file is equal to the sample file', () => {
        const testbuf = readFileSync(testDir + 'testMarkdown.md')
        const samplebuf = readFileSync(`${filePath}.md`)

        //Act and Assert
        expect(testbuf.equals(samplebuf)).toBe(true)
    })
})
