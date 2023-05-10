import { jest } from '@jest/globals';
import ixhToHtml from '../src/ixhToHtml';
import * as fs from 'fs';

import parseLine from '../src/parseLine';
import exp from 'constants';

describe('parseLine', () => {
    it('should return null for parsedLine if the line is a comment so it starts with //', () => {
        expect(parseLine('// this is a comment', [], 4)).toEqual({
            parsedLine: null,
            updatedTags: [],
        });
    });

    it('should return null for parsedLine if the line is whitespace', () => {
        expect(parseLine('    ', [], 4)).toEqual({
            parsedLine: null,
            updatedTags: [],
        });
    });

    it('should return a string literal without whitespace if the line starts with >{', () => {
        expect(parseLine('>{this is a string }', [], 4)).toEqual({
            parsedLine: 'this is a string ',
            updatedTags: [],
        });
    });

    it('should return the correct html for a single tag', () => {
        expect(parseLine('div', [], 4)).toEqual({
            parsedLine: '<div>',
            updatedTags: ['div'],
        });
    });

    it('should return the correct html for a single tag with a class', () => {
        expect(parseLine('div.class', [], 4)).toEqual({
            parsedLine: '<div class="class">',
            updatedTags: ['div'],
        });

        expect(parseLine('div        .class1', [], 4)).toEqual({
            parsedLine: '<div class="class1">',
            updatedTags: ['div'],
        });
    });

    it('should return the correct html for a single tag with multiple classes', () => {
        expect(parseLine('div.class1.class2', [], 4)).toEqual({
            parsedLine: '<div class="class1 class2">',
            updatedTags: ['div'],
        });

        expect(parseLine('div.class1    .class2.class3', [], 4)).toEqual({
            parsedLine: '<div class="class1 class2 class3">',
            updatedTags: ['div'],
        });
    });

    it('should return the correct html for a single tag with an id', () => {
        expect(parseLine('div#id', [], 4)).toEqual({
            parsedLine: '<div id="id">',
            updatedTags: ['div'],
        });

        expect(parseLine('div        #id', [], 4)).toEqual({
            parsedLine: '<div id="id">',
            updatedTags: ['div'],
        });
    });

    it('should return the correct html for a single tag with an attribute', () => {
        expect(parseLine('div%attr{value}', [], 4)).toEqual({
            parsedLine: '<div attr="value">',
            updatedTags: ['div'],
        });

        expect(parseLine('div      %attr{value}', [], 4)).toEqual({
            parsedLine: '<div attr="value">',
            updatedTags: ['div'],
        });
    });

    it('should return the correct html for a single tag with multiple attributes', () => {
        expect(parseLine('div%attr1{value1}%attr2{value2}', [], 4)).toEqual({
            parsedLine: '<div attr1="value1" attr2="value2">',
            updatedTags: ['div'],
        });

        expect(
            parseLine('div%attr1{value1}      %attr2{value2}', [], 4)
        ).toEqual({
            parsedLine: '<div attr1="value1" attr2="value2">',
            updatedTags: ['div'],
        });
    });

    it('should return the correct html for a single tag with multiple attributes and classes and an id', () => {
        expect(
            parseLine('div#id.class1.class2%attr1{value1}%attr2{value2}', [], 4)
        ).toEqual({
            parsedLine:
                '<div id="id" class="class1 class2" attr1="value1" attr2="value2">',
            updatedTags: ['div'],
        });

        expect(
            parseLine(
                'div #id .class1 .class2 %attr1{value1} %attr2{value2}',
                [],
                4
            )
        ).toEqual({
            parsedLine:
                '<div id="id" class="class1 class2" attr1="value1" attr2="value2">',
            updatedTags: ['div'],
        });
    });
});
