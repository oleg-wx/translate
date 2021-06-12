import { getDictionaryEntry } from './getDictionaryEntry';

describe('when getting dictionary entry', () => {
    it('should get fallback when provided', () => {
        expect(
            getDictionaryEntry('my-key', { 'my-key': 'my-entry' }, undefined)
        ).toBe('my-entry');
    });
});
