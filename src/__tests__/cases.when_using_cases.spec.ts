import { Translations } from '..';
describe('when using cases', () => {
    let key = 'somebody_ate_bananas';
    let translations = new Translations({
        en: {
            [key]: {
                value: '$&{prefix}$!{prefix}${person} ate bananas',
                cases: {
                    prefix: [
                        ['!!', ' '],
                        ['!', ''],
                    ],
                },
            },
            sir: 'Sir',
            madam: 'Madam',
        },
    });

    let values = [
        { prefix: 'sir', person: 'Holmes' },
        { prefix: 'madam', person: 'Holmes' },
        { prefix: '', person: 'Holmes' },
    ];

    let expectedEn = [
        'Sir Holmes ate bananas',
        'Madam Holmes ate bananas',
        'Holmes ate bananas',
    ];

    values.forEach((v, i) => {
        it(`should build ${v.prefix} => ${expectedEn[i]}`, () => {
            expect(translations.translateTo('en', key, v)).toBe(expectedEn[i]);
        });
    });
});

describe('when using cases and translations', () => {
    let key = 'somebody_ate_bananas';
    let translations = new Translations({
        en: {
            [key]: {
                value: '$!{prefix}${person} ate bananas',
                cases: {
                    prefix: [['!!', '(&{$#}) ']],
                },
            },
            sir: 'Sir',
            madam: 'Madam',
        },
    });

    let values = [
        { prefix: 'sir', person: 'Holmes' },
        { prefix: 'madam', person: 'Holmes' },
        { prefix: '', person: 'Holmes' },
    ];

    let expectedEn = [
        '(Sir) Holmes ate bananas',
        '(Madam) Holmes ate bananas',
        'Holmes ate bananas',
    ];

    values.forEach((v, i) => {
        it(`should build ${v.prefix} => ${expectedEn[i]}`, () => {
            expect(translations.translateTo('en', key, v)).toBe(expectedEn[i]);
        });
    });
});

describe('when using fallback with cases', () => {
    let key = 'somebody_ate_bananas';
    let translations = new Translations({
        en: {
            sir: 'Sir',
            madam: 'Madam',
        },
    });

    let values = [
        { prefix: 'sir', person: 'Holmes' },
        { prefix: 'madam', person: 'Holmes' },
        { prefix: '', person: 'Holmes' },
    ];

    let expectedEn = [
        '(Sir) Holmes ate bananas',
        '(Madam) Holmes ate bananas',
        'Holmes ate bananas',
    ];

    values.forEach((v, i) => {
        it(`should build ${v.prefix} => ${expectedEn[i]}`, () => {
            expect(
                translations.translateTo('en', key, v, {
                    value: '$!{prefix}${person} ate bananas',
                    cases: {
                        prefix: [['!!', '(&{$#}) ']],
                    },
                })
            ).toBe(expectedEn[i]);
        });
    });
});

describe('when using more complex cases', () => {
    let key = 'i_have_been_here_count';
    let translations = new Translations({
        en: {
            [key]: {
                value: '$!{count} ${days}',
                cases: {
                    count: [
                        ['!!', "I've been here ${count}"],
                        ['!', 'I have not been here'],
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

    let values = [
        { count: 0, days: 1 },
        { count: 2, days: 3 },
    ];

    let expectedEn = [
        'I have not been here today',
        "I've been here twice for last few days",
    ];

    values.forEach((v, i) => {
        it(`should replace ${v.count} for ${v.days} => ${expectedEn[i]}`, () => {
            expect(translations.translateTo('en', key, v)).toBe(expectedEn[i]);
        });
    });
});

describe('when using cases with translation references', () => {
    let key = 'hello_world';
    let translations = new Translations({
        en: {
            [key]: {
                value: 'Hello$!{type}World',
                cases: {
                    type: [
                        ['!!', ' &{hello_world.$#} '],
                        ['!', ' '],
                    ],
                },
                cruel: 'Cruel',
                nice: '&{nice}',
            },
            nice: 'Nice',
        },
    });

    let values:{type?:string}[] = [{}];

    let expectedEn = ['Hello World', 'Hello Nice World', 'Hello Cruel World'];

    values.forEach((v, i) => {
        it(`should replace and translate ${v.type} => ${expectedEn[i]}`, () => {
            expect(translations.translateTo('en', key, v)).toBe(expectedEn[i]);
        });
    });
});

describe('when using cases without param', () => {
    let key = 'hello_world';
    let translations = new Translations({
        en: {
            [key]: {
                value: 'Hello $!{type} World',
                cruel: 'Cruel',
                nice: 'Nice',
            },
        },
    });

    let values = [{}, { type: 'nice' }, { type: 'cruel' }];

    let expectedEn = ['Hello  World', 'Hello nice World', 'Hello cruel World'];

    values.forEach((v, i) => {
        it(`should replace not existing case with prop value ${v.type} => ${expectedEn[i]}`, () => {
            expect(translations.translateTo('en', key, v)).toBe(expectedEn[i]);
        });
    });
});
