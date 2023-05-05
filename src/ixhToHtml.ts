import * as fs from 'fs';

/**
 * Converts an ixh file to html and returns the html as a string or writes it to a file
 *
 * @param input The path to the ixh file
 * @param fileOutput If null, then the html is returned as a string, otherwise it is written to the file
 * @returns The html as a string if fileOutput is not provided or null, otherwise void
 */
const ixhToHtml = (
    parseLine: Function,
    input: string,
    fileOutput: string | null = null
) => {
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

export default ixhToHtml;
