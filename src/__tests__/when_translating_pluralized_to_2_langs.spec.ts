import { Dictionary, Translations } from '..';

describe('when translating pluralized to 2 langs', () => {
    let key = 'i-ate-${eggs}-${bananas}-dinner';
    let translations = new Translations({
        en: {
            [key]: {
                value: 'I ate ${bananas} and ${eggs} for dinner',
                plural: {
                    bananas: [
                        ['= 1 ', 'one banana'],
                        [`in [2,3,4]`, '$# bananas'],
                        ['< 1', 'no bananas'],
                        ['% 11', 'many bananas that is divisible by eleven'],
                        ['> 10', 'too many bananas'],
                        ['>= 5', 'many bananas'],
                        ['_', '$# bananas'],
                    ],
                    eggs: [
                        ['= 0', 'zero eggs'],
                        ['= 1', 'one egg'],
                        ['_', '$# eggs'],
                    ],
                },
                description: 'translations',
            },
        },
        ru: {
            [key]: {
                value: 'Я съел ${bananas} и ${eggs} на обед',
                plural: {
                    bananas: [
                        ['= 1', 'один банан'],
                        ['< 1', 'нуль бананов'],
                        ['in [2,3,4]', '$# банана'],
                        ['% 11', 'много бананов (делимое на 11)'],
                        ['> 10', 'слишком много бананов'],
                        ['> 5', 'много бананов'],
                        ['_', '$# бананов'],
                    ],
                    eggs: [
                        ['= 0', 'нуль яиц'],
                        ['= 1', 'одно яйцо'],
                        ['= 2', 'два яйца'],
                        ['in [3,4]', '$# яйца'],
                        ['_', '$# яйц'],
                    ],
                },
                description: 'translations',
            },
        },
    });

    let values = [
        { bananas: 0, eggs: 3 },
        { bananas: 1, eggs: 2 },
        { bananas: 3, eggs: 4 },
        { bananas: 10, eggs: 0 },
        { bananas: 121, eggs: 1 },
        { bananas: 12, eggs: 1 },
    ];

    beforeEach(() => {
        translations.lang = undefined;
    });

    let expectedEn = [
        'I ate no bananas and 3 eggs for dinner',
        'I ate one banana and 2 eggs for dinner',
        'I ate 3 bananas and 4 eggs for dinner',
        'I ate many bananas and zero eggs for dinner',
        'I ate many bananas that is divisible by eleven and one egg for dinner',
        'I ate too many bananas and one egg for dinner',
    ];

    let expectedNo = [
        'i-ate-3-0-dinner',
        'i-ate-2-1-dinner',
        'i-ate-4-3-dinner',
        'i-ate-0-10-dinner',
        'i-ate-1-121-dinner',
        'i-ate-1-12-dinner',
    ];

    values.forEach((v, i) => {
        it(`should translate plural to EN: ${expectedEn[i]}`, () => {
            expect(translations.translateTo('en', key, v)).toBe(expectedEn[i]);
        });
    });

    values.forEach((v, i) => {
        it(`should translate to set EN lang: ${expectedEn[i]}`, () => {
            translations.lang = 'en';
            expect(translations.lang).toBe('en');
            const val = translations.translate(key, v);
            expect(val).toBe(expectedEn[i]);
        });
    });

    values.forEach((v, i) => {
        it(`should NOT translate if NO default lang: ${expectedNo[i]}`, () => {
            expect(translations.lang).toBeUndefined();
            const val = translations.translate(key, v);
            expect(val).toBe(expectedNo[i]);
        });
    });

    let expectedRu = [
        'Я съел нуль бананов и 3 яйца на обед',
        'Я съел один банан и два яйца на обед',
        'Я съел 3 банана и 4 яйца на обед',
        'Я съел много бананов и нуль яиц на обед',
        'Я съел много бананов (делимое на 11) и одно яйцо на обед',
        'Я съел слишком много бананов и одно яйцо на обед',
    ];

    values.forEach((v, i) => {
        it(`should translate plural to RU: ${expectedRu[i]}`, () => {
            expect(translations.translateTo('ru', key, v)).toBe(expectedRu[i]);
        });
    });

    values.forEach((v, i) => {
        it(`should translate plural to RU default lang: ${expectedRu[i]}`, () => {
            translations.lang = 'ru';
            expect(translations.lang).toBe('ru');
            expect(translations.translate(key, v)).toBe(expectedRu[i]);
        });
    });
});
