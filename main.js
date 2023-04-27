const fs = require('fs');

const parseLine = (line, openedTags) => {
    let tag = null;
    let classes = [];
    let id = null;

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

        tag = token;
        openedTags.push(tag);
    });

    return `<${tag} class="${classes.join(' ')}" id="${id}">`;
};

const ixhToHtml = (file) => {
    const data = fs.readFileSync(file, 'utf8');
    const lines = data.split('\n');
    const openedTags = [];

    output = lines.map((line) => parseLine(line, openedTags));

    console.log(output);
};

ixhToHtml('data.ixh');
