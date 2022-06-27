import { Translations } from '..';

describe('when using dynamic parameters', () => {
    let key = 'i-ate-${bananas}-${when}';
    let translations = new Translations(
        {
            en: {
                [key]: {
                    value: 'I ate ${bananas} banana(s) for $&{when}',
                },
                dinner: 'Dinner',
                breakfast: 'Breakfast',
            },
            ru: {
                [key]: {
                    value: 'Я съел ${bananas} банан(а/ов) на $&{when}',
                },
                dinner: 'ужин',
                breakfast: 'завтрак',
            },
        },
        { cacheDynamic: true, lang: 'en' }
    );

    let values = [
        { bananas: 0, when: 'dinner' },
        {
            bananas: 3,
            when: 'breakfast',
        },
    ];

    let expectedEn = [
        'I ate 0 banana(s) for Dinner',
        'I ate 3 banana(s) for Breakfast',
    ];
    values.forEach((v, i) => {
        it(`should insert params when translate: ${expectedEn[i]}`, () => {
            const res = translations.translate(key, v);
            expect(res).toBe(expectedEn[i]);
        });
    });

    let expectedRu = [
        'Я съел 0 банан(а/ов) на ужин',
        'Я съел 3 банан(а/ов) на завтрак',
    ];

    values.forEach((v, i) => {
        it(`should insert params when translate to: ${expectedRu[i]}`, () => {
            expect(translations.translateTo('ru', key, v)).toBe(expectedRu[i]);
        });
    });
});
