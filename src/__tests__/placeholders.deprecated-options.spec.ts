import { Dictionaries, Translations } from '..';

const KEY = 'i-ate-bananas';

/**
 * `$less` and `defaultLang` are deprecated aliases for `placeholder: 'single'` and `lang`.
 * These tests pin them down until they are removed.
 */
const dictionaries = (value: string): Dictionaries => ({
    en: {
        [KEY]: { value },
        3: 'three',
    },
});

describe('when using the deprecated $less / defaultLang options', () => {
    it('maps constructor options onto placeholder="single" and lang', () => {
        const translations = new Translations(dictionaries('I ate {bananas} banana(s)'), {
            $less: true,
            defaultLang: 'en',
        });

        expect(translations.lang).toBe('en');
        expect(translations.placeholder).toBe('single');
        expect(translations.translateTo('en', KEY, { bananas: 3 })).toBe('I ate 3 banana(s)');
    });

    it('maps the properties onto placeholder="single" and lang', () => {
        const translations = new Translations(dictionaries('I ate {bananas} banana(s)'));
        translations.$less = true;
        translations.defaultLang = 'en';

        expect(translations.lang).toBe('en');
        expect(translations.placeholder).toBe('single');
        expect(translations.translateTo('en', KEY, { bananas: 3 })).toBe('I ate 3 banana(s)');
    });

    it('still translates `&{…}` placeholders in $-less mode', () => {
        const translations = new Translations(dictionaries('I ate &{bananas} banana(s)'), {
            $less: true,
            defaultLang: 'en',
        });

        expect(translations.translateTo('en', KEY, { bananas: 3 })).toBe('I ate three banana(s)');
    });
});
