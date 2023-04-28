const fs = require('fs');

const parseLine = (line, openedTags) => {
    if (line.trim().length === 0) return;

    let tag = null;
    let classes = [];
    let id = null;
    let attributes = {};
    let content = null;
    let output = '';

    // TEMP: assume 4 spaces for now
    let expectedIndent = openedTags.length * 4;

    // Check if the line is a string literal and return it without quotes
    if (line.trim().startsWith('"'))
        return line.trim().substring(1, line.trim().length - 1);

    // split on . or #, the "?=" is a lookahead that keeps the characters in the brackets in the token
    // the "?!" is a negative lookahead that makes sure the character is not inside {}
    let tokens = line.split(/(?=[>.#!])(?![^{]*})/);

    tokens.forEach((token) => {
        token = token.trim();

        if (token.startsWith('.')) {
            classes = [...classes, token.substring(1)];
            return;
        }

        if (token.startsWith('#')) {
            id = token.substring(1);
            return;
        }

        if (token.startsWith('!')) {
            // Attribute is the word after the ! and before the {
            // { is optional because attributes can be self closing such as disabled
            let attribute = token.match(/(?<=!)\w+(?=({)?)/)[0];

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
        let indent = token.match(/^\s+/);

        indent ? (currentIndent = indent[0].length) : (currentIndent = 0);

        while (currentIndent < expectedIndent) {
            let closedTag = openedTags.pop();
            output += `</${closedTag}>\n`;
            expectedIndent -= 4;
        }

        tag = token.trim();
        openedTags.push(tag);
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

    output += '>';

    if (content) {
        output += `\n${content}`;
    }

    return output;
};

const ixhToHtml = (input, fileOutput = null) => {
    const data = fs.readFileSync(input, 'utf8');
    const lines = data.split('\n');
    const openedTags = [];

    output = lines.map((line) => parseLine(line, openedTags));

    // Close any remaining tags
    while (openedTags.length > 0) {
        let closedTag = openedTags.pop();
        output.push(`</${closedTag}>`);
    }

    let outputString = output.filter((line) => line !== undefined).join('\n');

    if (fileOutput === null) return outputString;

    fs.writeFileSync(fileOutput, outputString);
};

{
    // let file = fs.readFileSync('sample.ixh', 'utf8');
    // let lines = file.split('\n');
    // let parsedLine = parseLine(lines[0], []);
    // console.log(parsedLine);
    console.log(ixhToHtml('sample.ixh'));
    ixhToHtml('sample.ixh', 'sample.html');
}
