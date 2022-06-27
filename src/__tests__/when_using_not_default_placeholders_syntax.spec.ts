import { Translations } from '..';

describe('when using $-less syntax', () => {
    test('should insert values in $-less placeholders', () => {
        let translations = new Translations(
            {
                en: {
                    'i-ate-bananas': {
                        value: 'I ate &{bananas} banana(s) and {apples}',
                        plural: {
                            apples: [
                                ['=1', 'one apple'],
                                ['_', '$# apples'],
                            ],
                        },
                    },
                    3: 'three',
                },
            },
            { cacheDynamic: true }
        );
        translations.placeholder = 'single';

        expect(
            translations.translateTo('en', 'i-ate-bananas', {
                bananas: 3,
                apples: 1,
            })
        ).toBe('I ate three banana(s) and one apple');
        expect(
            translations.translateTo('en', 'i-ate-bananas', {
                bananas: 3,
                apples: 2,
            })
        ).toBe('I ate three banana(s) and 2 apples');
    });

    test('should translate values in $-less placeholders ', () => {
        let translations = new Translations(
            {
                en: {
                    'i-ate-bananas': {
                        value: 'I ate &{{bananas}} banana(s) and {{apples}}',
                        plural: {
                            apples: [
                                ['=1', 'one apple'],
                                ['_', '$# apples'],
                            ],
                        },
                    },
                    3: 'three',
                },
            },
            { cacheDynamic: true, placeholder: 'double' }
        );

        expect(
            translations.translateTo('en', 'i-ate-bananas', {
                bananas: 3,
                apples: 1,
            })
        ).toBe('I ate three banana(s) and one apple');
        expect(
            translations.translateTo('en', 'i-ate-bananas', {
                bananas: 3,
                apples: 2,
            })
        ).toBe('I ate three banana(s) and 2 apples');
    });
});
