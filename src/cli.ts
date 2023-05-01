#!/usr/bin/env node
import * as fs from 'fs';
import ixhToHtml from './ixhToHtml';

let args = process.argv.slice(2);

let usageString = `Usage: ixhToHtml <input file> <output file>`;

if (args.length != 2) {
    console.log(usageString);
    process.exit(1);
}

let input = args[0];

if (!fs.existsSync(input)) {
    console.log(`Input file ${input} does not exist`);
    process.exit(1);
}

let output = args[1];

ixhToHtml(input, output);
