import parseLine from '../src/parseLine';

describe('parseLine', () => {
    it('should return null if the line is a comment so it starts with //', () => {
        expect(parseLine('// this is a comment', [], 4)).toEqual({
            parsedLine: null,
            updatedTags: [],
        });
    });

    it('should return null if the line is whitespace', () => {
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

    it('should return the correct html for a single tag with an attribute even if the attribute is already in quotes', () => {
        expect(parseLine('div%attr{"value"}', [], 4)).toEqual({
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

    it('should return the correct html for a single tag with a boolean attribute', () => {
        expect(parseLine('div%attr', [], 4)).toEqual({
            parsedLine: '<div attr>',
            updatedTags: ['div'],
        });
    });

    it('should return the correct html for a single tag with an inline string literal', () => {
        expect(parseLine('div>{this is a string}', [], 4)).toEqual({
            parsedLine: '<div>\nthis is a string',
            updatedTags: ['div'],
        });
    });

    it('should append the new tag to the list of tags if it is indented at a deeper level and is not self closing', () => {
        expect(parseLine('    div', ['div'], 4)).toEqual({
            parsedLine: '<div>',
            updatedTags: ['div', 'div'],
        });
    });

    it('should close the previous tag if the new tag is indented at the same level', () => {
        expect(parseLine('div', ['div'], 4)).toEqual({
            parsedLine: '</div>\n<div>',
            updatedTags: ['div'],
        });
    });

    it('should close the previous tag and the correct number of tags above it if the new tag is indented at a shallower level', () => {
        expect(parseLine('div', ['div', 'div'], 4)).toEqual({
            parsedLine: '</div>\n</div>\n<div>',
            updatedTags: ['div'],
        });

        expect(parseLine('    div', ['div', 'div', 'div'], 4)).toEqual({
            parsedLine: '</div>\n</div>\n<div>',
            updatedTags: ['div', 'div'],
        });
    });

    it('should properly write self closing tags (void elements)', () => {
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
            '!DOCTYPE', // This is not a tag but it is self closing
        ];

        voidElements.forEach((voidElement) => {
            expect(parseLine(voidElement, [], 4)).toEqual({
                parsedLine: `<${voidElement} />`,
                updatedTags: [],
            });
        });
    });

    it('should properly write string literals', () => {
        expect(parseLine('>{this is a string}', [], 4)).toEqual({
            parsedLine: 'this is a string',
            updatedTags: [],
        });
    });

    it('should close previous tags if a string literal is indentented at a shallower level', () => {
        expect(parseLine('>{this is a string}', ['div', 'div'], 4)).toEqual({
            parsedLine: '</div>\n</div>\nthis is a string',
            updatedTags: [],
        });

        expect(parseLine('    >{this is a string}', ['div', 'div'], 4)).toEqual(
            {
                parsedLine: '</div>\nthis is a string',
                updatedTags: ['div'],
            }
        );
    });
});
