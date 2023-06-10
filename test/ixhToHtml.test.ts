// Not really a unit test but more of an integration test
// since it relies on the parseLine function

const { vol } = require('memfs');

jest.mock('fs', () => require('memfs').fs);

import ixhToHtml from '../src/ixhToHtml';

describe('ixhToHtml', () => {
    beforeEach(() => {
        vol.reset();
    });

    it('should return the correct html for a single tag', () => {
        vol.fromJSON({
            'test.ixh': 'div',
        });

        expect(ixhToHtml('test.ixh')).toEqual(`<div>
</div>`);
    });

    it('should return the correct html for multiline strings', () => {
        vol.fromJSON({
            'test.ixh': `div 
    >{this is a 
    multiline string.
    and this is another line}`,
        });

        expect(ixhToHtml('test.ixh')).toEqual(`<div>
this is a multiline string. and this is another line
</div>`);
    });

    it('should return a file if fileOutput is provided', () => {
        vol.fromJSON({
            'test.ixh': 'div',
        });

        ixhToHtml('test.ixh', 'test.html');

        expect(vol.readFileSync('test.html', 'utf8')).toEqual(`<div>
</div>`);
    });
});
