import { getDictionaryEntry } from './getDictionaryEntry';
import { TranslationKey } from './translationKey';

describe('when getting dictionary entry', () => {
    it('should get value', () => {
        expect(
            getDictionaryEntry(new TranslationKey('my-key'), { 'my-key': 'my-entry' }, undefined)
        ).toBe('my-entry');
    });
});
describe('when getting dictionary entry in the namespace', () => {
    const dic = { space: { 'my-key': 'my-entry' } };
    it('should get value form namespace with string key', () => {
        expect(getDictionaryEntry(new TranslationKey('space.my-key'), dic, undefined)).toBe(
            'my-entry'
        );
    });
    it('should get value form namespace with array key', () => {
        expect(getDictionaryEntry(new TranslationKey(['space','my-key']), dic, undefined)).toBe(
            'my-entry'
        );
    });
    it('should return undefined if no translation', () => {
        expect(getDictionaryEntry(new TranslationKey(['no-key']), dic)).toBeUndefined();
    });

    it('should return undefined with namespaces if no translation', () => {
        expect(getDictionaryEntry(new TranslationKey(['no-key','no']), dic)).toBeUndefined();
    });
});
