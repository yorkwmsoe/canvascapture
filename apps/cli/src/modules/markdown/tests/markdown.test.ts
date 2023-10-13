import {
    cleanFile,
    createCodeBlock,
    createInlineCode,
    createList,
    createTableHeader,
    createTableRows, writeToFile
} from "@modules/markdown/markdown";

var fc = require('filecompare');



describe("markdown", () => {

    const testDir = "./src/modules/markdown/tests/"

    let isEqualTest:boolean = true;
    const filePath = testDir + "sample.md"
    const inline: string = createInlineCode(filePath, "HELP MEEEEE")
    const block: string = createCodeBlock(filePath, "HELP MEEEEE")
    const list: string = createList(["one", "two", "three"], "- [ ]")
    const head: string = createTableHeader(["col1", "aerodynamics"])
    const rows: string = createTableRows([["one", "two"], ["three", "four"]])
    cleanFile(filePath)
    writeToFile(filePath, head)
    writeToFile(filePath, rows)
    writeToFile(filePath, list)
    writeToFile(filePath, inline)
    writeToFile(filePath,block)


    test("should return true ",  () => {
        let isEqualTest: boolean = false;

        const cb = (isEqual: boolean) => {
            isEqualTest = isEqual;
            console.log(isEqual)
        }
        //console.log(process.cwd());
        fc(testDir + 'testMarkdown.md', testDir + 'sample.md', cb)
        expect(isEqualTest).toBe(true);
    });

});