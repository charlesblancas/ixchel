import * as fs from 'fs';

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
 * While the current indent is less than the expected indent, close tags and
 * add them to the output
 *
 * @param token
 * @param expectedIndent
 * @param spacesForIndent
 * @param openedTags
 * @param currentOuput
 * @returns
 */
const makeIndentationMatch = (
    token: string,
    expectedIndent: number,
    spacesForIndent: number,
    openedTags: string[],
    currentOuput: string
) => {
    let indent = token.match(/^\s+/);
    let currentIndent = 0;

    indent ? (currentIndent = indent[0].length) : (currentIndent = 0);

    while (currentIndent < expectedIndent) {
        let closedTag = openedTags[openedTags.length - 1];
        openedTags = openedTags.slice(0, -1);
        currentOuput += `</${closedTag}>\n`;
        expectedIndent -= spacesForIndent;
    }

    return {
        newOutput: currentOuput,
        newExpectedIndent: expectedIndent,
        updatedTags: openedTags,
    };
};

/**
 *
 *
 * @param line
 * @param openedTags
 * @param spacesForIndent
 * @returns
 */
const parseLine = (
    line: string,
    openedTags: string[],
    spacesForIndent: number
) => {
    if (line.trim().length === 0)
        return { parsedLine: null, updatedTags: openedTags };

    let tag: string = '';
    let classes: string[] = [];
    let id: string | null = null;
    let attributes: { [key: string]: string } = {};
    let content: string | null = null;
    let output = '';

    let expectedIndent = openedTags.length * spacesForIndent;

    // If line starts with //, then it is a comment
    if (line.trim().startsWith('//')) {
        return { parsedLine: null, updatedTags: openedTags };
    }

    // Check if the line starts with a >, and treat the contents of the {} as a literal
    if (line.trim().startsWith('>')) {
        let content = line.match(/(?<={).+(?=})/)![0];

        const { newOutput, updatedTags } = makeIndentationMatch(
            line,
            expectedIndent,
            spacesForIndent,
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
            let attribute = token.match(/(?<=%)\w+(?=({)?)/)![0];

            // Value is the text inside the {} if it exists
            let valueMatch = token.match(/(?<={).+(?=})/);
            let value: string | null = null;
            if (valueMatch) value = valueMatch[0];

            attributes[attribute] = value!;

            return;
        }

        if (token.startsWith('>')) {
            // Take the value inside the {} and set it as the content
            content = token.match(/(?<={).+(?=})/)![0];
            return;
        }

        // If the current indent is less than the expected indent, then we need to close tags
        const { newOutput, newExpectedIndent, updatedTags } =
            makeIndentationMatch(
                token,
                expectedIndent,
                spacesForIndent,
                openedTags,
                output
            );

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

            // If attribute is wrapped in quotes, then don't wrap it in quotes again
            if (attributes[key].match(/^".+"$/)) {
                output += ` ${key}=${attributes[key]}`;
                return;
            }

            output += ` ${key}="${attributes[key]}"`;
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

const ixhToHtml = (input: string, fileOutput: string | null = null) => {
    const data = fs.readFileSync(input, 'utf8');
    const lines = data.split('\n');
    let openedTags: string[] = [];
    let indentation: number | null = null;

    let output = lines.map((line) => {
        if (!indentation) {
            let matchWithWhitespace = line.match(/^\s+/);
            indentation = matchWithWhitespace
                ? matchWithWhitespace[0].length
                : null;
        }

        const { parsedLine, updatedTags } = parseLine(
            line,
            openedTags,
            indentation!
        );

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
    ixhToHtml('./sample/resume/resume2.ixh', './sample/resume/resume2.html');
}
