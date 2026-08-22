import { Dictionary, Translations } from '..';
import { PluralOptions } from '../core/types';

const KEY = 'i-ate-${bananas}';

/**
 * A rule per CLDR category. `other` is the catch-all — `handlePluralize` treats it exactly like
 * `_` — so any number with no category in the target language lands there.
 */
const categoryRules = (): PluralOptions => [
    ['zero', 'no bananas'],
    ['one', 'one banana'],
    ['two', 'two bananas'],
    ['few', 'a few bananas'],
    ['many', 'many bananas'],
    ['other', '$# bananas'],
];

const dictionary = (): Dictionary => ({
    [KEY]: {
        value: 'I ate ${bananas}',
        plural: { bananas: categoryRules() },
        description: 'translations',
    },
});

describe('when using CLDR plural rules', () => {
    /**
     * Each language matches only the categories CLDR actually gives it, which is the whole point
     * of delegating to `Intl.PluralRules`. English has just `one`, so every other number falls to
     * `_`; Arabic and Welsh exercise all six.
     */
    describe.each([
        {
            locale: 'en',
            has: 'one, other',
            expectations: [
                { bananas: 1, expected: 'one banana' },
                { bananas: -1, expected: 'one banana' }, // CLDR compares magnitude
                { bananas: 0, expected: '0 bananas' },
                { bananas: 2, expected: '2 bananas' },
                { bananas: 3, expected: '3 bananas' },
                { bananas: 11, expected: '11 bananas' },
                { bananas: 100, expected: '100 bananas' },
            ],
        },
        {
            locale: 'ru',
            has: 'one, few, many, other',
            expectations: [
                { bananas: 1, expected: 'one banana' },
                { bananas: 21, expected: 'one banana' },
                { bananas: 2, expected: 'a few bananas' },
                { bananas: 3, expected: 'a few bananas' },
                { bananas: 0, expected: 'many bananas' },
                { bananas: 5, expected: 'many bananas' },
                { bananas: 11, expected: 'many bananas' },
                { bananas: 100, expected: 'many bananas' },
            ],
        },
        {
            locale: 'ar',
            has: 'all six',
            expectations: [
                { bananas: 0, expected: 'no bananas' },
                { bananas: 1, expected: 'one banana' },
                { bananas: 2, expected: 'two bananas' },
                { bananas: 3, expected: 'a few bananas' },
                { bananas: 6, expected: 'a few bananas' },
                { bananas: 11, expected: 'many bananas' },
                { bananas: 100, expected: '100 bananas' }, // `other`
            ],
        },
        {
            locale: 'cy',
            has: 'all six',
            expectations: [
                { bananas: 0, expected: 'no bananas' },
                { bananas: 1, expected: 'one banana' },
                { bananas: 2, expected: 'two bananas' },
                { bananas: 3, expected: 'a few bananas' },
                { bananas: 6, expected: 'many bananas' },
                { bananas: 5, expected: '5 bananas' }, // `other`
            ],
        },
    ])('$locale ($has)', ({ locale, expectations }) => {
        const translations = new Translations({ [locale]: dictionary() });

        it.each(expectations)('$bananas → "I ate $expected"', ({ bananas, expected }) => {
            expect(translations.translateTo(locale, KEY, { bananas })).toBe(`I ate ${expected}`);
        });
    });

    describe('mixed with numeric rules', () => {
        // First match wins, so an exact number can be special-cased ahead of its category —
        // something CLDR categories alone cannot express.
        const translations = new Translations({
            en: {
                [KEY]: {
                    value: 'I ate ${bananas}',
                    plural: {
                        bananas: [
                            ['= 0', 'nothing at all'],
                            ['one', 'a single banana'],
                            ['in [2,3]', 'a couple of bananas'],
                            ['_', '$# bananas'],
                        ],
                    },
                },
            },
        });

        it.each([
            { bananas: 0, expected: 'nothing at all', why: 'the exact rule wins over `one`' },
            { bananas: 1, expected: 'a single banana', why: 'the category matches' },
            { bananas: 2, expected: 'a couple of bananas', why: 'a numeric rule after a category' },
            { bananas: 9, expected: '9 bananas', why: 'the default' },
        ])('$bananas → "I ate $expected" ($why)', ({ bananas, expected }) => {
            expect(translations.translateTo('en', KEY, { bananas })).toBe(`I ate ${expected}`);
        });
    });

    describe('one rule set shared by several languages', () => {
        // The compiled matcher is cached on the rule itself, so it must stay locale-agnostic:
        // the locale is applied at match time, not when the rule is compiled.
        const shared = categoryRules();
        const entry = { value: 'I ate ${bananas}', plural: { bananas: shared } };
        const translations = new Translations({ en: { [KEY]: entry }, ru: { [KEY]: entry } });

        it('gives each language its own answer, whichever runs first', () => {
            expect(translations.translateTo('en', KEY, { bananas: 3 })).toBe('I ate 3 bananas');
            expect(translations.translateTo('ru', KEY, { bananas: 3 })).toBe('I ate a few bananas');
            expect(translations.translateTo('en', KEY, { bananas: 3 })).toBe('I ate 3 bananas');
        });
    });

    describe('when the dictionary key is not a real locale', () => {
        // `lang` is just a dictionary key in this library, but CLDR needs a BCP 47 tag.
        it('throws for a key that is not a well-formed tag', () => {
            const translations = new Translations({ main: dictionary() });

            expect(() => translations.translateTo('main', KEY, { bananas: 1 })).toThrow(
                'invalid locale for CLDR: "main"'
            );
        });

        it('silently resolves a well-formed but unassigned tag against the runtime default', () => {
            // `fb` is structurally valid, so `Intl` accepts it and negotiates down to the
            // runtime's default locale instead of failing. Documented here because it means
            // an arbitrary two-letter dictionary key yields machine-dependent categories.
            const translations = new Translations({ fb: dictionary() });
            const runtimeDefault = new Intl.PluralRules('fb').resolvedOptions().locale;

            expect(runtimeDefault).not.toBe('fb');
            expect(() => translations.translateTo('fb', KEY, { bananas: 1 })).not.toThrow();
        });
    });
});
