import { Translations } from '..';

describe('when using $-less syntax', () => {
    test('should insert values in $-less placeholders', () => {
        let translations = new Translations(
            {
                en: {
                    'i-ate-bananas': {
                        value: 'I ate {bananas} banana(s)',
                    },
                    3: 'three',
                },
            },
        );
        // SET no $
        translations.$less = true;
        translations.defaultLang = 'en';

        expect(translations.lang).toBe('en');
        expect(translations.placeholder).toBe('single');
        expect(
            translations.translateTo('en', 'i-ate-bananas', {
                bananas: 3,
            })
        ).toBe('I ate 3 banana(s)');
    });

    test('should translate values in $-less placeholders ', () => {
        let translations = new Translations(
            {
                en: {
                    'i-ate-bananas': {
                        value: 'I ate &{bananas} banana(s)',
                    },
                    3: 'three',
                },
            },
            { $less: true, defaultLang: 'en' }
        );

        expect(translations.lang).toBe('en');
        expect(translations.placeholder).toBe('single');
        expect(
            translations.translateTo('en', 'i-ate-bananas', {
                bananas: 3,
            })
        ).toBe('I ate three banana(s)');
    });
});
