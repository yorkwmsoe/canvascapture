import {appendFileSync} from 'fs';
import {writeFileSync} from 'fs';

/**
 * writeToFile
 * Allows user to specify the file name which the markdown will be written to
 * @param filePath
 * @param markdownContent
 */
export const writeToFile = (filePath: string, markdownContent: string) => {
    appendFileSync(filePath, markdownContent);
}

/**
 * convertToHeader
 * Allows the user to create header generated content and to specify a desired size
 * @param markdownContent
 * @param size
 */
export const convertToHeader = (markdownContent: string, size: number) => {
    let headerSize = "";
    for (let i: number = 0; i < size; i++) {
        headerSize = headerSize + "#"
    }
    return headerSize + " " + markdownContent;
}

/**
 * performSpecialWordOperation
 * Allows the user to either bold, strikethrough, or italicize a specific word or words
 * within a block of text. The content is the body of text that contains the special word.
 * The word is the desired word to be affected. To specify the operation, the type variable
 * must either be "bold" or "strikethrough" or "italic". The specified is an number: index
 * array that will perform the operation on the indexes where the word appear in the content
 * @param content
 * @param word
 * @param type
 * @param specified
 */
export const performSpecialWordOperation = (content: string, word: string, type: "bold" | "italic" | "strike", specified: number[]) => {
    const indexes: number[] = [];
    let tempContent = content;
    let fauxWord = "";
    let addition = ""

    //different types: Bold, Italic, Strikethrough
    if (type === "bold") {
        addition = "**"
    } else if (type === "italic") {
        addition = "*"
    } else if (type === "strike") {
        addition = "~~"
    }

    const addLength = addition.length * 2;

    for (let i = 0; i < word.length; i++) {
        fauxWord = fauxWord + "."
    }

    while (tempContent.indexOf(word) != -1) {
        indexes.push(tempContent.indexOf(word));
        tempContent = tempContent.replace(word, fauxWord);
    }

    let retContent = tempContent;
    let numPrevLength = 0;
    let numSpecialWords = 0;

    for (let i = 0; i < indexes.length; i++) {
        if((specified.filter(value => (value == i + 1))).length > 0) {
            let pre = retContent.substring(0, indexes[i] + numPrevLength);
            let post = retContent.substring(indexes[i] + word.length + numPrevLength);
            retContent = pre + addition + word + addition + post;
            numSpecialWords = numSpecialWords + 1;
            numPrevLength = addLength * (numSpecialWords);
        } else {
            let pre = retContent.substring(0, indexes[i] + numPrevLength);
            let post = retContent.substring(indexes[i] + word.length + numPrevLength);
            retContent = pre + word + post;
            numPrevLength = addLength * (numSpecialWords);
        }
    }
    return retContent
}

/**
 * createList
 * This allows the user to create a list with an array of strings, the type is either "-"
 * or "*" or "+" or "- [ ]"
 * @param content
 * @param type
 */
export const createList = (content: string[], type: string) => {
    let list = "";
    if (type === "o") {
        for (let i = 1; i < content.length + 1; i++) {
            const start = "" + i + ". "
            list = list + start + content[i - 1] + "\n"
        }
    } else {
        for (let i = 0; i < content.length; i++) {
            list = list + type + " " + content[i] + "\n";
        }
    }
    return list;
}

/**
 * createLink
 * This creates a link within a block of text. Content is the block of text, wordClick is the
 * phrase to be highlighted and clickable to the attached link. link is the actual desired link
 * @param content
 * @param wordClick
 * @param link
 */
export const createLink = (content: string, wordClick: string, link: string) => {
    return content.replace(wordClick, "[" + wordClick + "]" +
        "(" + link + ")")
}

/**
 * generateIMG
 * This takes in a path, local to one's machine or directory, and generates the image
 * If the image path is entered incorrectly, the text "Image not found" is displayed
 * @param path
 */
export const generateIMG = (path: string) => {
    return "![Image not found](" + path + ")";
}

/**
 * addNewLine
 * Kind of overkill for a method but it just adds a newline character to the specified file
 * @param filePath
 */
export const addNewLine = (filePath: string) => {
    appendFileSync(filePath, "\n");
    appendFileSync(filePath, "\n");
}

/**
 * Cleans the specified file
 * @param filePath
 */
export const cleanFile = (filePath: string) => {
    writeFileSync(filePath, '');
}

/**
 * Creates inline code given a filePath and the string content
 * @param filePath
 * @param content
 */
export const createInlineCode = (content: string) => {
    return "`" + content + "`";
}

/**
 * Creates an actual coding block given a filepath
 * @param filePath
 * @param content
 */
export const createCodeBlock = (content: string) => {
    return "\n```\n" + content + "\n```\n";
}

/**
 * Creates the header rows for a table given a list of strings
 * @param columns
 */
export const createTableHeader = (columns: string[]) => {
    let header = ""
    for(let i:number = 0; i < columns.length; i++){
        header = header + " " + columns[i] + " |"
    }
    header = "|" + header + "\n";

    let headerBar = "";
    for(let i:number = 0; i < columns.length; i++){
        headerBar = headerBar + " --- |"
    }
    headerBar = "|" + headerBar + "\n";
    return header + headerBar;
}

/**
 * Creates all the table rows given a 2D array
 * @param rows
 */
export const createTableRows = (rows:string[][]) => {
    let rowsToPrint = "";
    for(let row:number = 0; row < rows.length; row++){
        let rowPrint = "";
        for(let col = 0; col < rows[0].length; col++) {
            rowPrint = rowPrint + " " + rows[row][col] + " |";
        }
        rowPrint = "|" + rowPrint + "\n";
        rowsToPrint = rowsToPrint + rowPrint;
    }
    return rowsToPrint;
}
