import { Dictionaries, PlaceholderType, Translations } from '..';

const KEY = 'i-ate-bananas';

// `&{…}` marks a placeholder to translate, a bare `{…}` one to insert as-is.
const SINGLE_BRACE_DICTIONARIES: Dictionaries = {
    en: {
        [KEY]: {
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
};

const DOUBLE_BRACE_DICTIONARIES: Dictionaries = {
    en: {
        [KEY]: {
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
};

const CASES = [
    { props: { bananas: 3, apples: 1 }, expected: 'I ate three banana(s) and one apple' },
    { props: { bananas: 3, apples: 2 }, expected: 'I ate three banana(s) and 2 apples' },
];

describe('when using a $-less placeholder syntax', () => {
    describe.each([
        { placeholder: 'single' as PlaceholderType, dictionaries: SINGLE_BRACE_DICTIONARIES },
        { placeholder: 'double' as PlaceholderType, dictionaries: DOUBLE_BRACE_DICTIONARIES },
    ])('placeholder: "$placeholder"', ({ placeholder, dictionaries }) => {
        it.each(CASES)('set through the constructor options → "$expected"', ({ props, expected }) => {
            const translations = new Translations(dictionaries, { placeholder });

            expect(translations.translateTo('en', KEY, props)).toBe(expected);
        });

        it.each(CASES)('set through the property → "$expected"', ({ props, expected }) => {
            const translations = new Translations(dictionaries);
            translations.placeholder = placeholder;

            expect(translations.translateTo('en', KEY, props)).toBe(expected);
        });
    });
});
