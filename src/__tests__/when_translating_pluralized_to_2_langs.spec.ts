import { Dictionary, Translations } from '..';

describe('when translating pluralized to 2 langs', () => {
    let key = 'i-ate-${eggs}-${bananas}-dinner';
    let translations = new Translations(
        {
            en: {
                [key]: {
                    value: 'I ate ${bananas} and ${eggs} for dinner',
                    plural: {
                        bananas: [
                            ['= 1 ', 'one banana'],
                            [`in [2,3,4]`, '$# bananas'],
                            ['< 1', 'no bananas'],
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
        },
        { cacheDynamic: true }
    );

    let values = [
        { bananas: 0, eggs: 3 },
        { bananas: 1, eggs: 2 },
        { bananas: 3, eggs: 4 },
        { bananas: 10, eggs: 0 },
        { bananas: 11, eggs: 1 },
    ];

    beforeEach(() => {
        translations.lang = undefined;
    });

    let expectedEn = [
        'I ate no bananas and 3 eggs for dinner',
        'I ate one banana and 2 eggs for dinner',
        'I ate 3 bananas and 4 eggs for dinner',
        'I ate many bananas and zero eggs for dinner',
        'I ate too many bananas and one egg for dinner',
    ];

    it('should translate plural to EN', () => {
        values.forEach((v, i) => {
            expect(translations.translateTo('en', key, v)).toBe(expectedEn[i]);
        });
    });
    it('should translate plural to EN default lang', () => {
        translations.lang = 'en';
        values.forEach((v, i) => {
            expect(translations.translate(key, v)).toBe(expectedEn[i]);
        });
    });

    let expectedRu = [
        'Я съел нуль бананов и 3 яйца на обед',
        'Я съел один банан и два яйца на обед',
        'Я съел 3 банана и 4 яйца на обед',
        'Я съел много бананов и нуль яиц на обед',
        'Я съел слишком много бананов и одно яйцо на обед',
    ];

    it('should translate plural to RU', () => {
        values.forEach((v, i) => {
            expect(translations.translateTo('ru', key, v)).toBe(expectedRu[i]);
        });
    });
    test('should translate plural to RU default lang', () => {
        translations.lang = 'ru';
        values.forEach((v, i) => {
            expect(translations.translate(key, v)).toBe(expectedRu[i]);
        });
    });

    test('cached', () => {
        expect(Object.keys(translations.dynamicCache['en']).length).toBe(5);
    });
});
