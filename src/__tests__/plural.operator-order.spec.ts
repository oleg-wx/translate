import { Translations } from '..';

const LANG = 'en';
const KEY = 'i-ate-${bananas}-dinner';

const translations = new Translations({
    [LANG]: {
        [KEY]: {
            value: 'I ate ${bananas} for dinner',
            plural: {
                bananas: [
                    ['<= 3', 'few bananas'],
                    ['>= 3', 'several bananas'],
                    // Every rule below is shadowed by the two above: `<= 3` already covers
                    // everything up to 3 and `>= 3` covers everything from 3 up.
                    ['< 1', 'no bananas'],
                    ['> 5', 'too many bananas'],
                    ['= 1', 'one bananas'],
                    ['_', 'some bananas'],
                ],
            },
            description: 'translations',
        },
    },
});

describe('when using order of operators over the comparison', () => {
    it.each([
        { bananas: -1, plural: 'few bananas' },
        { bananas: 0, plural: 'few bananas' },
        { bananas: 1, plural: 'few bananas' },
        { bananas: 2, plural: 'few bananas' },
        { bananas: 3, plural: 'few bananas' },
        { bananas: 4, plural: 'several bananas' },
        { bananas: 5, plural: 'several bananas' },
        { bananas: 6, plural: 'several bananas' },
        { bananas: 7, plural: 'several bananas' },
    ])('$bananas matches the first rule in declaration order → "$plural"', ({ bananas, plural }) => {
        expect(translations.translateTo(LANG, KEY, { bananas })).toBe(`I ate ${plural} for dinner`);
    });

    it('never reaches a rule shadowed by an earlier one', () => {
        const shadowed = ['no bananas', 'too many bananas', 'one bananas', 'some bananas'];
        const translated = [-1, 0, 1, 2, 3, 4, 5, 6, 7].map((bananas) =>
            translations.translateTo(LANG, KEY, { bananas })
        );

        shadowed.forEach((plural) => {
            expect(translated).not.toContain(`I ate ${plural} for dinner`);
        });
    });
});
