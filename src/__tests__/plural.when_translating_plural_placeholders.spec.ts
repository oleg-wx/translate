import { Translations } from '..';

describe('when translating plural placeholders', () => {
    let translations = new Translations(
        {
            en: {
                'i-ate-{apples}-{when}': {
                    value: 'I ate $&{apples} for $&{when}',
                    plural: {
                        apples: [
                            ['=0', ''],
                            ['= 1', 'One apple'],
                            ['= 4', '&{my-$#-only} apple'],
                            ['in [2,3]', '&{$#} apples'],
                            ['= 42', '$&{answer} apples'],
                            ['= 100', '${o$#} apples'],
                            ['= 101', 'hundred and &{1} apple'],
                            ['_', '$# apple(s)'],
                        ],
                    },
                },
                dinner: 'Dinner',
                breakfast: 'Breakfast',
                'my-4-only': 'Only Four',
                '1': 'One',
                '2': 'Two',
                '3': 'Three',
                'the-ultimate': 'the Ultimate Amount of',
            },
        },
    );

    let values = [
        {
            apples: 0,
            when: 'breakfast',
        },
        {
            apples: 101,
            when: 'breakfast',
        },
        {
            apples: 42,
            when: 'dinner',
            answer: 'the-ultimate',
        },
        {
            apples: 1,
            when: 'dinner',
        },
        {
            apples: 2,
            when: 'breakfast',
        },
        {
            apples: 3,
            when: 'dinner',
        },
        {
            apples: 4,
            when: 'breakfast',
        },
        {
            apples: 5,
            when: 'dinner',
        },
        {
            apples: 100,
            when: 'dinner',
            o100: 'H U N D R E D',
        },
    ];

    let expectedEn = [
        'I ate  for Breakfast',
        'I ate hundred and One apple for Breakfast',
        'I ate the Ultimate Amount of apples for Dinner',
        'I ate One apple for Dinner',
        'I ate Two apples for Breakfast',
        'I ate Three apples for Dinner',
        'I ate Only Four apple for Breakfast',
        'I ate 5 apple(s) for Dinner',
        'I ate H U N D R E D apples for Dinner',
    ];

    values.forEach((v, i) => {
        it(`should translate plural placeholder: ${expectedEn[i]}`, () => {
            var t = translations.translateTo('en', 'i-ate-{apples}-{when}', v);
            expect(t).toBe(expectedEn[i]);
        });
    });
});
