import { Translations } from '..';

const LANG = 'en';
const KEY = 'i-ate-${eggs}-${bananas}-dinner';

const translations = new Translations({
    [LANG]: {
        [KEY]: {
            value: 'I ate ${bananas} for dinner',
            plural: {
                bananas: [
                    ['= 1', 'one banana'],
                    ['in [2,3]', '$# bananas'],
                    ['between 4 and 6', '4-6 bananas'],
                    ['< 1', 'no bananas'],
                    ['<= 8', 'few bananas'],
                    ['> 12', 'too many bananas'],
                    ['>= 10', 'several bananas'],
                    ['_', 'about $# bananas'],
                ],
            },
            description: 'translations',
        },
    },
});

describe('when inserting numbers conditionally with plural options', () => {
    // The first rule that matches wins, so these expectations also document the rule order above:
    // `<= 8` never sees 1..6 and `>= 10` never sees anything above 12.
    it.each([
        { bananas: 1, plural: 'one banana' }, // = 1
        { bananas: 2, plural: '2 bananas' }, // in [2,3]
        { bananas: 3, plural: '3 bananas' }, // in [2,3]
        { bananas: 4, plural: '4-6 bananas' }, // between 4 and 6
        { bananas: 5, plural: '4-6 bananas' }, // between 4 and 6
        { bananas: 6, plural: '4-6 bananas' }, // between 4 and 6
        { bananas: 0, plural: 'no bananas' }, // < 1
        { bananas: -1, plural: 'no bananas' }, // < 1
        { bananas: 7, plural: 'few bananas' }, // <= 8
        { bananas: 8, plural: 'few bananas' }, // <= 8
        { bananas: 13, plural: 'too many bananas' }, // > 12
        { bananas: 10, plural: 'several bananas' }, // >= 10
        { bananas: 11, plural: 'several bananas' }, // >= 10
        { bananas: 12, plural: 'several bananas' }, // >= 10
        { bananas: 9, plural: 'about 9 bananas' }, // _ (default)
    ])('$bananas → "I ate $plural for dinner"', ({ bananas, plural }) => {
        expect(translations.translateTo(LANG, KEY, { bananas })).toBe(`I ate ${plural} for dinner`);
    });
});
