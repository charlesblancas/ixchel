const fs = require('fs');

const voidElements = [
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'keygen',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr',
    '!DOCTYPE', // This is not a real tag but it is self closing
];

/**
 *
 * @param {string} token
 * @param {number} expectedIndent
 * @param {string[]} openedTags
 * @param {string} currentOuput
 * @returns {{newOutput: string, newExpectedIndent: number, updatedTags: string[]}}
 */
const makeIndentationMatch = (
    token,
    expectedIndent,
    openedTags,
    currentOuput
) => {
    let indent = token.match(/^\s+/);

    indent ? (currentIndent = indent[0].length) : (currentIndent = 0);

    while (currentIndent < expectedIndent) {
        let closedTag = openedTags[openedTags.length - 1];
        openedTags = openedTags.slice(0, -1);
        currentOuput += `</${closedTag}>\n`;
        expectedIndent -= 4;
    }

    return {
        newOutput: currentOuput,
        newExpectedIndent: expectedIndent,
        updatedTags: openedTags,
    };
};

/**
 *
 * @param {string} line The line to be parsed
 * @param {string[]} openedTags The tags that are currently open
 * @returns {{parsedLine: string | null, updatedTags: string[]}} Returns the parsed line or null if line is whitespace and the updated opened tags
 */
const parseLine = (line, openedTags) => {
    if (line.trim().length === 0)
        return { parsedLine: null, updatedTags: openedTags };

    let tag = null;
    let classes = [];
    let id = null;
    let attributes = {};
    let content = null;
    let output = '';

    // TEMP: assume 4 spaces for now
    let expectedIndent = openedTags.length * 4;

    // Check if the line starts with a >, and treat the contents of the {} as a literal
    if (line.trim().startsWith('>')) {
        let content = line.match(/(?<={).+(?=})/)[0];

        const { newOutput, updatedTags } = makeIndentationMatch(
            line,
            expectedIndent,
            openedTags,
            output
        );

        return {
            parsedLine: `${newOutput}${content}`,
            updatedTags,
        };
    }

    // split on . or #, the "?=" is a lookahead that keeps the characters in the brackets in the token
    // the "?!" is a negative lookahead that makes sure the character is not inside {}
    let tokens = line.split(/(?=[>.#%])(?![^{]*})/);

    tokens.forEach((token) => {
        token = token.trimEnd();

        if (token.startsWith('.')) {
            classes = [...classes, token.substring(1)];
            return;
        }

        if (token.startsWith('#')) {
            id = token.substring(1);
            return;
        }

        if (token.startsWith('%')) {
            // Attribute is the word after the % and before the {
            // { is optional because attributes can be self closing such as disabled
            let attribute = token.match(/(?<=%)\w+(?=({)?)/)[0];

            // Value is the text inside the {} if it exists
            let value = token.match(/(?<={).+(?=})/);
            if (value) value = value[0];

            attributes[attribute] = value;

            return;
        }

        if (token.startsWith('>')) {
            // Take the value inside the {} and set it as the content
            content = token.match(/(?<={).+(?=})/)[0];
            return;
        }

        // If the current indent is less than the expected indent, then we need to close tags
        const { newOutput, newExpectedIndent, updatedTags } =
            makeIndentationMatch(token, expectedIndent, openedTags, output);

        output = newOutput;
        expectedIndent = newExpectedIndent;

        tag = token.trim();
        openedTags = [...updatedTags, tag];
    });

    output += `<${tag}`;

    if (classes.length > 0) {
        output += ` class="${classes.join(' ')}"`;
    }

    if (id) {
        output += ` id="${id}"`;
    }

    if (Object.keys(attributes).length > 0) {
        Object.keys(attributes).forEach((key) => {
            if (attributes[key] === null) {
                output += ` ${key}`;
                return;
            }

            output += ` ${key}=${attributes[key]}`;
        });
    }

    if (voidElements.includes(tag)) {
        openedTags = openedTags.slice(0, -1);
        output += ' />';
        return { parsedLine: output, updatedTags: openedTags };
    }

    output += '>';

    if (content) {
        output += `\n${content}`;
    }

    return { parsedLine: output, updatedTags: openedTags };
};

/**
 *
 * @param {string} input This is the name of the file to be converted
 * @param {string} fileOutput This is the name of the file to be outputted, leave empty if you want to return the string
 * @returns {void | string} Returns void if fileOutput is specified, otherwise returns the HTML as a string
 */
const ixhToHtml = (input, fileOutput = null) => {
    const data = fs.readFileSync(input, 'utf8');
    const lines = data.split('\n');
    let openedTags = [];

    output = lines.map((line) => {
        const { parsedLine, updatedTags } = parseLine(line, openedTags);
        openedTags = updatedTags;
        return parsedLine;
    });

    // Close any remaining tags
    while (openedTags.length > 0) {
        let closedTag = openedTags[openedTags.length - 1];
        openedTags = openedTags.slice(0, -1);
        output = [...output, `</${closedTag}>`];
    }

    let outputString = output.filter((line) => line !== null).join('\n');

    if (fileOutput === null) return outputString;

    fs.writeFileSync(fileOutput, outputString);
};

{
    // let file = fs.readFileSync('sample.ixh', 'utf8');
    // let lines = file.split('\n');
    // let parsedLine = parseLine(lines[0], []);
    // console.log(parsedLine);
    //console.log(ixhToHtml('sample.ixh'));
    ixhToHtml('resume.ixh', 'resume.html');
}
