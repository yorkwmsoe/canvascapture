import * as fs from 'fs-extra';

/**
 * writeToFile
 * Allows user to specify the file name which the markdown will be written to
 * @param filePath
 * @param markdownContent
 */
export const writeToFile = (filePath: string, markdownContent: string) => {
    fs.appendFileSync(filePath, markdownContent);
}

/**
 * convertToHeader
 * Allows the user to create header generated content and to specify a desired size
 * @param markdownContent
 * @param size
 */
export const convertToHeader = (markdownContent: string, size: number) => {
    let headerSize = " ";
    for (let i: number = 0; i < size; i++) {
        headerSize = headerSize + "#"
    }
    let headerContent: string = headerSize + markdownContent;
    return headerContent;
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
export const performSpecialWordOperation = (content: string, word: string, type: string, specified: number[]) => {
    let indexes: number[] = [];
    let tempContent: string = content;
    let fauxWord: string = "";
    let addition: string = ""
    let numEncounted: number = 0;

    //different types: Bold, Italic, Strikethrough
    if (type.toLowerCase() === "bold") {
        addition = "**"
    } else if (type.toLowerCase() === "italic") {
        addition = "*"
    } else if (type.toLowerCase() === "strike") {
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
    let numSpecialWords: number = 0;

    for (let i = 0; i < indexes.length; i++) {


        if((specified.filter(value => (value == i + 1))).length > 0) {
            let pre: string = retContent.substring(0, indexes[i] + numPrevLength);
            let post: string = retContent.substring(indexes[i] + word.length + numPrevLength);
            retContent = pre + addition + word + addition + post;
            numSpecialWords = numSpecialWords + 1;
            numPrevLength = addLength * (numSpecialWords);
        } else {
            let pre: string = retContent.substring(0, indexes[i] + numPrevLength);
            let post: string = retContent.substring(indexes[i] + word.length + numPrevLength);
            retContent = pre + word + post;
            numPrevLength = addLength * (numSpecialWords);
        }

    }
    return retContent
}

/**
 * createList
 * This allows the user to create a list with an array of strings, the type is either "-"
 * or "*" or "+"
 * @param content
 * @param type
 */
export const createList = (content: string[], type: string) => {
    let list: string = "";
    if (type === "o") {
        for (let i = 1; i < content.length + 1; i++) {
            let start: string = "" + i + ". "
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
    content = content.replace(wordClick, "[" + wordClick + "]" +
        "(" + link + ")")
    return content;
}

/**
 * generateIMG
 * This takes in a path, local to one's machine or directory, and generates the image
 * If the image path is entered incorrectly, the text "Image not found" is displayed
 * @param path
 */
export const generateIMG = (path: string) => {
    let content: string = "![Image not found](" + path + ")";
    return content;
}

/**
 * addNewLine
 * Kind of overkill for a method but it just adds a newline character to the specified file
 * @param filePath
 */
export const addNewLine = (filePath: string) => {
    fs.appendFileSync(filePath, "\n");
}

/**
 * Cleans the specified file
 * @param filePath
 */
export const cleanFile = (filePath: string) => {
    fs.writeFileSync(filePath, '');
}



// const filePath = 'output.md';
//
// //testing markdown
// let sampleText = "banana work banana work banana work banana work"
// let sampleList: string[] = ["one", "two", "three"]
// cleanFile(filePath)
// writeToFile(filePath, createList(sampleList, "-"))
// writeToFile(filePath, createList(sampleList, "+"))
// writeToFile(filePath, createList(sampleList, "*"))
// writeToFile(filePath, createList(sampleList, "o"))
// addNewLine(filePath);
// writeToFile(filePath, performSpecialWordOperation(sampleText, "work", "bold", [1, 3]));
// addNewLine(filePath);
// let link: string = createLink("dis is google", "google", "https://www.google.com/")
// writeToFile(filePath, link)
// let img: string = generateIMG("C:\\Users\\mcdonaldp\\WebstormProjects\\rema\\src\\ambatukam.png")
// writeToFile(filePath, img)




