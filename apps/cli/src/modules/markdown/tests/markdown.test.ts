import {
    addNewLine,
    cleanFile, convertToHeader,
    createCodeBlock,
    createInlineCode, createLink,
    createList,
    createTableHeader,
    createTableRows, generateIMG, performSpecialWordOperation, writeToFile
} from "@modules/markdown/markdown";

const fs = require("fs");
describe("markdown test", () => {
    //Arrange

    //Directory of tests to append for file location
    const testDir = "./src/modules/markdown/tests/"
    //Path of testing file
    const filePath = testDir + "sample"

    //Create all headers
    const header1: string = convertToHeader("Help Me", 1);
    const header2: string = convertToHeader("Help Me", 2);
    const header3: string = convertToHeader("Help Me", 3);
    const header4: string = convertToHeader("Help Me", 4);
    const header5: string = convertToHeader("Help Me", 5);
    const header6: string = convertToHeader("Help Me", 6);

    //Create simple phrase and perform multiple special word operations on it.
    let phrase = "The banana crossed the road and decided to eat some banana because the banana wanted to try banana";
    phrase = performSpecialWordOperation(phrase, "banana", "bold", [1,3])
    phrase = performSpecialWordOperation(phrase, "banana", "strike", [2,4])
    phrase = performSpecialWordOperation(phrase, "the", "strike", [1,2])

    //Create Table
    const head: string = createTableHeader(["Cars", "Sports"])
    const rows: string = createTableRows([["Honda", "hockey"], ["Ford", "baseball"]])

    //Create all Lists
    const simpList = "## Simple List"
    const checkList: string = createList(["one", "two", "three"], "- [ ]")
    const astList: string = createList(["one", "two", "three"], "*")
    const plusList: string = createList(["one", "two", "three"], "+")
    const dashList: string = createList(["one", "two", "three"], "-")

    //Create Link and Image
    const ikeaLink = createLink("Here is the Link to Ikea", "Link", "https://ikea.com")
    const image = generateIMG(testDir + "testIMG/Luh-Calm-Fit.png")

    //Create coding syntax
    const inline: string = createInlineCode("HELP MEEEEE")
    const block: string = createCodeBlock("HELP MEEEEE")

    //Cleanfile and write all headers
    cleanFile(filePath)
    writeToFile(filePath, header1)
    addNewLine(filePath)
    writeToFile(filePath, header2)
    addNewLine(filePath)
    writeToFile(filePath, header3)
    addNewLine(filePath)
    writeToFile(filePath, header4)
    addNewLine(filePath)
    writeToFile(filePath, header5)
    addNewLine(filePath)
    writeToFile(filePath, header6)
    addNewLine(filePath)

    //Append phrase to file
    writeToFile(filePath, phrase)
    addNewLine(filePath)

    //Append Table to file
    writeToFile(filePath, head)
    writeToFile(filePath, rows)
    addNewLine(filePath)

    //Append all lists to file
    writeToFile(filePath, simpList + " Check")
    addNewLine(filePath)
    writeToFile(filePath, checkList)
    writeToFile(filePath, simpList + " Asterisk")
    addNewLine(filePath)
    writeToFile(filePath, astList)
    writeToFile(filePath, simpList + " Plus")
    addNewLine(filePath)
    writeToFile(filePath, plusList)
    writeToFile(filePath, simpList + " Dash")
    addNewLine(filePath)
    writeToFile(filePath, dashList)
    addNewLine(filePath)


    //Append link and image to file
    writeToFile(filePath, ikeaLink)
    addNewLine(filePath)
    writeToFile(filePath, image)
    addNewLine(filePath)
    writeToFile(filePath, inline)
    writeToFile(filePath,block)

    test("that the generated markdown file is equal to the sample file",  () => {
        const testbuf = fs.readFileSync(testDir + 'testMarkdown.md')
        const samplebuf = fs.readFileSync(`${filePath}.md`)

        //Act and Assert
        expect(testbuf.equals(samplebuf)).toBe(true);
    });

    test("that the pdf exists", () => {
        //Act and Assert
        console.log(filePath);
        expect(fs.existsSync(`${filePath}.pdf`)).toBe(true);
    });
});
