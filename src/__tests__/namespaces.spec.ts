import { Dictionary, Translations } from '..';

const LANG = 'en-US';

const dictionary: Dictionary = {
    // A key that merely *looks* namespaced is not reachable — lookup always walks real nesting.
    'will.not.work': 'nope',
    item: {
        test: {
            value: 'test: ${num}',
            plural: {
                num: [
                    ['= 0', 'none'],
                    ['= 1', 'one test'],
                    ['= 100', '&{onehundred} tests'], // resolved from the dictionary root
                    ['= 200', '&{item.twohundred} tests'], // resolved by explicit namespace path
                    ['_', '$# tests'],
                ],
            },
        },
        twohundred: 'Two Hundred',
    },
    onehundred: {
        value: 'One Hundred',
    },
};

const translations = new Translations({ [LANG]: dictionary }, { lang: LANG });

describe('when using namespaces', () => {
    it.each([
        { num: 105, expected: 'test: 105 tests' },
        { num: 100, expected: 'test: One Hundred tests' },
        { num: 200, expected: 'test: Two Hundred tests' },
    ])('resolves an entry nested in a namespace: num $num → "$expected"', ({ num, expected }) => {
        expect(translations.translate('item.test', { num })).toBe(expected);
    });

    it('does not match a flat key that contains namespace separators', () => {
        const translated = translations.translate('will.not.work');

        expect(translated).not.toBe('nope');
        expect(translated).toBe('will.not.work');
    });

    // Resolution must stay inside the dictionary rather than walking the prototype chain
    // or indexing into an entry that has already resolved to a string.
    it.each(['constructor.name', '__proto__.constructor.name', 'item.twohundred.0'])(
        'falls back to the key instead of resolving "%s"',
        (key) => {
            expect(translations.hasTranslation(key)).toBe(false);
            expect(translations.translate(key)).toBe(key);
        }
    );
});
