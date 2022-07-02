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
                    prefix: [
                        ['!!', '(&{$#}) '],
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
