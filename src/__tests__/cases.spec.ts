import { DictionaryEntry, TranslateDynamicProps, Translations } from '..';

describe('when using cases', () => {
    const KEY = 'somebody_ate_bananas';
    const translations = new Translations({
        en: {
            [KEY]: {
                value: '$!{prefix}${person} ate bananas',
                cases: {
                    prefix: [
                        ['!!', '&{$#} '], // truthy: translate the prefix and keep a trailing space
                        ['!', ''], // falsy: drop it entirely
                    ],
                },
            },
            sir: 'Sir',
            madam: 'Madam',
        },
    });

    it.each([
        { props: { prefix: 'sir', person: 'Holmes' }, expected: 'Sir Holmes ate bananas' },
        { props: { prefix: 'madam', person: 'Holmes' }, expected: 'Madam Holmes ate bananas' },
        { props: { prefix: '', person: 'Holmes' }, expected: 'Holmes ate bananas' },
    ])('prefix "$props.prefix" → "$expected"', ({ props, expected }) => {
        expect(translations.translateTo('en', KEY, props)).toBe(expected);
    });
});

describe('when using cases wrapped in literal text', () => {
    const KEY = 'somebody_ate_bananas';
    const ENTRY: DictionaryEntry = {
        value: '$!{prefix}${person} ate bananas',
        cases: {
            prefix: [['!!', '(&{$#}) ']],
        },
    };

    const CASES = [
        { props: { prefix: 'sir', person: 'Holmes' }, expected: '(Sir) Holmes ate bananas' },
        { props: { prefix: 'madam', person: 'Holmes' }, expected: '(Madam) Holmes ate bananas' },
        // No matching case and no `!` rule, so the whole case placeholder resolves to nothing.
        { props: { prefix: '', person: 'Holmes' }, expected: 'Holmes ate bananas' },
    ];

    describe('from the dictionary entry', () => {
        const translations = new Translations({
            en: { [KEY]: ENTRY, sir: 'Sir', madam: 'Madam' },
        });

        it.each(CASES)('prefix "$props.prefix" → "$expected"', ({ props, expected }) => {
            expect(translations.translateTo('en', KEY, props)).toBe(expected);
        });
    });

    describe('from a fallback entry passed to translateTo', () => {
        const translations = new Translations({
            en: { sir: 'Sir', madam: 'Madam' },
        });

        it.each(CASES)('prefix "$props.prefix" → "$expected"', ({ props, expected }) => {
            expect(translations.translateTo('en', KEY, props, ENTRY)).toBe(expected);
        });
    });
});

describe('when combining cases with plurals', () => {
    const KEY = 'i_have_been_here_count';
    const translations = new Translations({
        en: {
            [KEY]: {
                value: '$!{count} ${days}',
                cases: {
                    count: [
                        ['!', 'I have not been here'],
                        ['_', "I've been here ${count}"],
                    ],
                },
                plural: {
                    count: [
                        ['=1', 'once'],
                        ['=2', 'twice'],
                        ['in [3,4,5]', 'few times'],
                        ['>10', 'many times'],
                        ['_', '$# times'],
                    ],
                    days: [
                        ['<2', 'today'],
                        ['<5', 'for last few days'],
                        ['_', 'for long time'],
                    ],
                },
            },
        },
    });

    it.each([
        { props: { count: 0, days: 1 }, expected: 'I have not been here today' },
        { props: { count: 2, days: 3 }, expected: "I've been here twice for last few days" },
    ])('count $props.count over $props.days day(s) → "$expected"', ({ props, expected }) => {
        expect(translations.translateTo('en', KEY, props)).toBe(expected);
    });
});

describe('when a case references another translation', () => {
    const KEY = 'hello_world';
    const translations = new Translations({
        en: {
            [KEY]: {
                value: 'Hello$!{type}World',
                cases: {
                    type: [
                        ['!!', ' &{hello_world.$#} '], // look the value up inside this entry's namespace
                        ['!', ' '],
                    ],
                },
                cruel: 'Cruel',
                nice: '&{nice}', // in turn references the root-level `nice`
            },
            nice: 'Nice',
        },
    });

    it.each([
        { props: {}, expected: 'Hello World' },
        { props: { type: 'nice' }, expected: 'Hello Nice World' },
        { props: { type: 'cruel' }, expected: 'Hello Cruel World' },
    ])('type "$props.type" → "$expected"', ({ props, expected }) => {
        expect(translations.translateTo('en', KEY, props)).toBe(expected);
    });
});

describe('when an entry has a case placeholder but no cases', () => {
    const KEY = 'hello_world';
    const translations = new Translations({
        en: {
            [KEY]: {
                value: 'Hello $!{type} World',
                cruel: 'Cruel',
                nice: 'Nice',
            },
        },
    });

    it.each([
        { props: {}, expected: 'Hello  World' },
        // Without any case rules the raw prop value is inserted, untranslated.
        { props: { type: 'nice' }, expected: 'Hello nice World' },
        { props: { type: 'cruel' }, expected: 'Hello cruel World' },
    ])('type "$props.type" → "$expected"', ({ props, expected }) => {
        expect(translations.translateTo('en', KEY, props)).toBe(expected);
    });
});

describe('when cases reference pluralized translations', () => {
    const KEY = 'hello';
    const translations = new Translations({
        en: {
            [KEY]: {
                value: 'Hello $!{type}',
                cases: {
                    // `==` compares case-insensitively.
                    type: [
                        ['==friend', '&{hello.friend}'],
                        ['==enemy', '&{hello.enemy}'],
                        ['==Neutral', '&{hello.neutral}'],
                        ['_', '${count} anon'],
                    ],
                },
                friend: {
                    value: '${count}',
                    plural: {
                        count: [
                            ['=1', 'friend'],
                            ['>1', '$# friends'],
                        ],
                    },
                },
                enemy: {
                    value: '${count}',
                    plural: {
                        count: [
                            ['=1', 'enemy'],
                            ['>1', '$# enemies'],
                        ],
                    },
                },
                neutral: {
                    value: '${count}',
                    plural: {
                        count: [
                            ['=1', 'neutral'],
                            ['>1', '$# neutrals'],
                        ],
                    },
                },
            },
        },
    });

    it.each([
        { props: { type: 'friend', count: 1 }, expected: 'Hello friend' },
        { props: { type: 'friend', count: 10 }, expected: 'Hello 10 friends' },
        { props: { type: 'enemy', count: 1 }, expected: 'Hello enemy' },
        { props: { type: 'enemy', count: 10 }, expected: 'Hello 10 enemies' },
        { props: { type: 'NeuTraL', count: 10 }, expected: 'Hello 10 neutrals' },
        { props: { type: 'Nope', count: 10 }, expected: 'Hello 10 anon' },
    ])('type "$props.type" with count $props.count → "$expected"', ({ props, expected }) => {
        expect(translations.translateTo('en', KEY, props)).toBe(expected);
    });
});

describe('when a case value is falsy, truthy, undefined or null', () => {
    const KEY = 'test_it';
    const translations = new Translations({
        en: {
            [KEY]: {
                // The same prop drives both a case placeholder and a plain one.
                value: '$!{prefix}${prefix} test',
                cases: {
                    prefix: [
                        ['!!', '&{$#} '],
                        ['!', ''],
                    ],
                },
            },
        },
    });

    it.each([
        { prefix: '', expected: ' test' },
        { prefix: null, expected: ' test' },
        { prefix: undefined, expected: ' test' },
        { prefix: true, expected: 'true true test' },
        { prefix: false, expected: 'false test' },
        { prefix: 1, expected: '1 1 test' },
        { prefix: 0, expected: '0 test' },
    ])('prefix $prefix → "$expected"', ({ prefix, expected }) => {
        const props = { prefix } as TranslateDynamicProps;

        expect(translations.translateTo('en', KEY, props)).toBe(expected);
    });
});
