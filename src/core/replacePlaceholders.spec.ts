import { replacePlaceholders } from "./replacePlaceholders";

describe('when replacing placeholders', () => {
    it('should replace placeholders with provided values', () => {
        expect(
            replacePlaceholders(replaceRe, { 'my-key': 'my-entry' }, undefined)
        ).toBe('my-entry');
    });
});
