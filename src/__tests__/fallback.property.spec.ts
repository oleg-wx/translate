import { Translations } from '..';

const LANG = 'en';

// Nothing is translated here; every test relies on a fallback value passed to `translateTo`.
const translations = new Translations({ [LANG]: {} });

describe('when falling back to property', () => {
    describe('a placeholder with no fallback of its own', () => {
        const FALLBACK = 'I ate ${bananas} banana(s) for $&{when?supper}';

        it.each([
            // `bananas` has no `?default`, so a missing value leaves an empty gap.
            { props: { when: 'breakfast' }, expected: 'I ate  banana(s) for breakfast' },
            { props: { bananas: 3 }, expected: 'I ate 3 banana(s) for supper' },
            { props: { bananas: 3, when: undefined }, expected: 'I ate 3 banana(s) for supper' },
        ])('$props → "$expected"', ({ props, expected }) => {
            expect(translations.translateTo(LANG, 'i-ate-bananas-when-fallback', props, FALLBACK)).toBe(expected);
        });
    });

    describe('a placeholder carrying its own `?default`', () => {
        const FALLBACK = 'I ate ${bananas?some amount of} banana(s) for $&{when?launch}';

        it.each([
            { props: { when: 'breakfast' }, expected: 'I ate some amount of banana(s) for breakfast' },
            { props: { bananas: 3 }, expected: 'I ate 3 banana(s) for launch' },
            { props: { bananas: 3, when: undefined }, expected: 'I ate 3 banana(s) for launch' },
        ])('$props → "$expected"', ({ props, expected }) => {
            expect(translations.translateTo(LANG, 'i-ate-bananas-when-fallback-dynamic', props, FALLBACK)).toBe(
                expected
            );
        });
    });
});
