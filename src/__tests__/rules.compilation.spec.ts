import { Dictionaries, DictionaryEntry, Translations } from '..';

function deepFreeze<T>(value: T): T {
    Object.values(value as Record<string, unknown>).forEach((child) => {
        if (child && typeof child === 'object') {
            deepFreeze(child);
        }
    });

    return Object.freeze(value) as T;
}

describe('when compiling plural and case rules', () => {
    describe('a dictionary the caller has frozen', () => {
        // Compiled matchers are cached per expression rather than written onto the rule, so
        // translating must never write to caller-owned data.
        const dictionaries: Dictionaries = {
            en: {
                ate: {
                    value: 'I ate ${bananas}',
                    plural: {
                        bananas: [
                            ['= 1', 'one banana'],
                            ['_', '$# bananas'],
                        ],
                    },
                },
                greet: {
                    value: 'Hello $!{name}',
                    cases: {
                        name: [
                            ['!!', '$#'],
                            ['!', 'stranger'],
                        ],
                    },
                },
            },
        };

        it.each([
            { key: 'ate', props: { bananas: 1 }, expected: 'I ate one banana' },
            { key: 'ate', props: { bananas: 5 }, expected: 'I ate 5 bananas' },
            { key: 'greet', props: { name: 'Basil' }, expected: 'Hello Basil' },
            { key: 'greet', props: { name: '' }, expected: 'Hello stranger' },
        ])('translates $key with $props', ({ key, props, expected }) => {
            const translations = new Translations(deepFreeze(dictionaries));

            expect(translations.translateTo('en', key, props)).toBe(expected);
        });

        it('leaves the rules exactly two items long', () => {
            const translations = new Translations(deepFreeze(dictionaries));
            translations.translateTo('en', 'ate', { bananas: 1 });

            const entry = dictionaries.en.ate as DictionaryEntry;

            entry.plural!.bananas.forEach((rule) => expect(rule).toHaveLength(2));
            expect(JSON.parse(JSON.stringify(dictionaries))).toEqual(dictionaries);
        });
    });

    describe('the plural and case operator lists stay separate', () => {
        // Both handlers memoise compiled matchers, but from different operator lists. A shared
        // cache would let an expression compiled for a plural satisfy a case that must reject it.
        it.each([
            { expression: 'in [1,2]', n: 1, why: 'an array match' },
            { expression: 'between 1 and 2', n: 1, why: 'a range' },
            { expression: '% 2', n: 2, why: 'a remainder' },
            { expression: 'one', n: 1, why: 'a CLDR category' },
        ])('still rejects $expression ($why) in a case after a plural compiled it', ({ expression, n }) => {
            const translations = new Translations({
                en: {
                    counted: {
                        value: '${n}',
                        plural: {
                            n: [
                                [expression, 'matched'],
                                ['_', '$#'],
                            ],
                        },
                    },
                    cased: {
                        value: '$!{n}',
                        cases: {
                            n: [
                                [expression, 'matched'],
                                ['_', '$#'],
                            ],
                        },
                    },
                },
            });

            // Compile it for plurals first — this is what could poison a shared cache.
            expect(translations.translateTo('en', 'counted', { n })).toBe('matched');

            expect(() => translations.translateTo('en', 'cased', { n })).toThrow(
                `case operator "${expression}" not supported`
            );
        });
    });

    describe('one expression shared by many entries', () => {
        it('compiles once and stays correct for each entry', () => {
            const rule = '= 1';
            const translations = new Translations({
                en: {
                    bananas: { value: '${n}', plural: { n: [[rule, 'one banana'], ['_', '$# bananas']] } },
                    eggs: { value: '${n}', plural: { n: [[rule, 'one egg'], ['_', '$# eggs']] } },
                },
            });

            expect(translations.translateTo('en', 'bananas', { n: 1 })).toBe('one banana');
            expect(translations.translateTo('en', 'eggs', { n: 1 })).toBe('one egg');
            expect(translations.translateTo('en', 'bananas', { n: 2 })).toBe('2 bananas');
            expect(translations.translateTo('en', 'eggs', { n: 2 })).toBe('2 eggs');
        });
    });
});
