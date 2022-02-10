import { getDictionaryEntry } from './getDictionaryEntry';
import { TranslateKeyInstance } from './translationKey';

describe('when getting dictionary entry', () => {
    it('should get value', () => {
        expect(
            getDictionaryEntry(
                { en: { 'my-key': 'my-entry' } },
                'en',
                new TranslateKeyInstance('my-key')
            )
        ).toBe('my-entry');
    });
});
describe('when getting dictionary entry in the namespace', () => {
    const lang = 'en';
    const dics = { [lang]: { space: { 'my-key': 'my-entry' } } };
    it('should get value form namespace with string key', () => {
        expect(
            getDictionaryEntry(dics, lang, new TranslateKeyInstance('space.my-key'))
        ).toBe('my-entry');
    });
    it('should get value form namespace with array key', () => {
        expect(
            getDictionaryEntry(
                dics,
                lang,
                new TranslateKeyInstance(['space', 'my-key'])
            )
        ).toBe('my-entry');
    });
    it('should return undefined if no translation', () => {
        expect(
            getDictionaryEntry(dics, lang, new TranslateKeyInstance(['no-key']))
        ).toBeUndefined();
    });

    it('should return undefined with namespaces if no translation', () => {
        expect(
            getDictionaryEntry(dics, lang, new TranslateKeyInstance(['no-key', 'no']))
        ).toBeUndefined();
    });
});
