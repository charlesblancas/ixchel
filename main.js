const fs = require('fs');

const parseLine = (line, openedTags) => {
    if (line.trim().length === 0) return;

    let tag = null;
    let classes = [];
    let id = null;
    let output = '';

    // TEMP: assume 4 spaces for now
    let expectedIndent = openedTags.length * 4;

    // Check if the line is a string literal and return it without quotes
    if (line.trim().startsWith('"'))
        return line.trim().substring(1, line.trim().length - 1);

    // split on . or #, the "?=" is a lookahead that keeps the . or # in the token
    let tokens = line.split(/(?=\.)|(?=#)/);

    tokens.forEach((token) => {
        if (token.startsWith('.')) {
            classes = [...classes, token.substring(1)];
            return;
        }

        if (token.startsWith('#')) {
            id = token.substring(1);
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

    output += '>';

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
    // let file = fs.readFileSync('data.ixh', 'utf8');
    // let lines = file.split('\n');
    // let parsedLine = parseLine(lines[0], []);
    // console.log(parsedLine);
    console.log(ixhToHtml('sample.ixh'));
    ixhToHtml('sample.ixh', 'sample.html');
}
