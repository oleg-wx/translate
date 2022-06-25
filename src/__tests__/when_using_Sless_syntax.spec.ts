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
            { cacheDynamic: true }
        );
        debugger;
        // SET no $
        translations.$less = true;
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
            { cacheDynamic: true, $less: true }
        );
        translations.lang = 'en';

        expect(
            translations.translateTo('en', 'i-ate-bananas', {
                bananas: 3,
            })
        ).toBe('I ate three banana(s)');
    });
});
