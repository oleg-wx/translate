import { Translations } from '..';

const LANG = 'en';
const KEY = 'i-ate-{apples}-{when}';

const translations = new Translations({
    [LANG]: {
        [KEY]: {
            value: 'I ate $&{apples} for $&{when}',
            plural: {
                apples: [
                    ['=0', ''],
                    ['= 1', 'One apple'],
                    ['= 4', '&{my-$#-only} apple'], // `$#` is the matched number, so this reads `my-4-only`
                    ['in [2,3]', '&{$#} apples'], // translates the number itself
                    ['= 42', '$&{answer} apples'], // translates whatever the `answer` prop points at
                    ['= 100', '${o$#} apples'], // inserts the `o100` prop as-is
                    ['= 101', 'hundred and &{1} apple'],
                    ['_', '$# apple(s)'],
                ],
            },
        },
        dinner: 'Dinner',
        breakfast: 'Breakfast',
        'my-4-only': 'Only Four',
        1: 'One',
        2: 'Two',
        3: 'Three',
        'the-ultimate': 'the Ultimate Amount of',
    },
});

describe('when translating plural placeholders', () => {
    it.each([
        { props: { apples: 0, when: 'breakfast' }, expected: 'I ate  for Breakfast' },
        { props: { apples: 1, when: 'dinner' }, expected: 'I ate One apple for Dinner' },
        { props: { apples: 2, when: 'breakfast' }, expected: 'I ate Two apples for Breakfast' },
        { props: { apples: 3, when: 'dinner' }, expected: 'I ate Three apples for Dinner' },
        { props: { apples: 4, when: 'breakfast' }, expected: 'I ate Only Four apple for Breakfast' },
        { props: { apples: 5, when: 'dinner' }, expected: 'I ate 5 apple(s) for Dinner' },
        { props: { apples: 101, when: 'breakfast' }, expected: 'I ate hundred and One apple for Breakfast' },
        {
            props: { apples: 42, when: 'dinner', answer: 'the-ultimate' },
            expected: 'I ate the Ultimate Amount of apples for Dinner',
        },
        {
            props: { apples: 100, when: 'dinner', o100: 'H U N D R E D' },
            expected: 'I ate H U N D R E D apples for Dinner',
        },
    ])('$props.apples apples → "$expected"', ({ props, expected }) => {
        expect(translations.translateTo(LANG, KEY, props)).toBe(expected);
    });
});
