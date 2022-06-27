import { Dictionary, Translations } from '..';

describe('when falling back to property', () => {
    let translations = new Translations({ en: {} }, { cacheDynamic: true });
    let values: { bananas?: number; when?: string }[] = [
        { when: 'breakfast' },
        { bananas: 3 },
        { bananas: 3, when: undefined },
    ];
    let expectedDef = [
        'I ate bananas banana(s) for breakfast',
        'I ate 3 banana(s) for when',
        'I ate 3 banana(s) for when',
    ];
    let expectedFallback = [
        'I ate some amount of banana(s) for breakfast',
        'I ate 3 banana(s) for launch',
        'I ate 3 banana(s) for launch',
    ];
    values.forEach((v, i) => {
        it(`should fallback to property name: ${expectedDef[i]}`, () => {
            var t = translations.translateTo(
                'en',
                'i-ate-bananas-when-fallback',
                v,
                'I ate ${bananas} banana(s) for $&{when}'
            );
            expect(t).toBe(expectedDef[i]);
        });
    });

    values.forEach((v, i) => {
        it(`should fallback to property fallback value: ${expectedFallback[i]}`, () => {
            var t = translations.translateTo(
                'en',
                'i-ate-bananas-when-fallback-dynamic',
                v,
                'I ate ${bananas?some amount of} banana(s) for $&{when?launch}'
            );
            expect(t).toBe(expectedFallback[i]);
        });
    });
});
