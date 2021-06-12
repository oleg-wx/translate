import { getDictionaryEntry } from './getDictionaryEntry';
import { TranslateKey } from './translationKey';

describe('when getting dictionary entry', () => {
    it('should get value', () => {
        expect(
            getDictionaryEntry(new TranslateKey('my-key'), { 'my-key': 'my-entry' }, undefined)
        ).toBe('my-entry');
    });
});
describe('when getting dictionary entry in the namespace', () => {
    const dic = { space: { 'my-key': 'my-entry' } };
    it('should get value form namespace with string key', () => {
        expect(getDictionaryEntry(new TranslateKey('space.my-key'), dic, undefined)).toBe(
            'my-entry'
        );
    });
    it('should get value form namespace with array key', () => {
        debugger
        expect(getDictionaryEntry(new TranslateKey(['space','my-key']), dic, undefined)).toBe(
            'my-entry'
        );
    });
    it('should return key form namespace with no item in namespace', () => {
        debugger
        expect(getDictionaryEntry(new TranslateKey(['space','my-key','another-key']), dic, undefined)).toBe(
            'space.my-key.another-key'
        );
    });
});
