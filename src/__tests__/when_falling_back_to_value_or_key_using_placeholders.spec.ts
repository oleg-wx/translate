import { Translations } from '..';
describe('when falling back to value or key using placeholders', () => {
    let translations = new Translations(
        {
            en: {},
        },
        { cacheDynamic: true }
    );

    let values = [
        {
            bananas: 0,
            when: 'dinner',
        },
        {
            bananas: 3,
            when: 'breakfast',
        },
    ];

    let expectedEn = [
        'I ate 0 banana(s) for dinner',
        'I ate 3 banana(s) for breakfast',
    ];

    values.forEach((v, i) => {
        it(`should fallback to value with dynamic ${expectedEn[i]}`, () => {
            var t = translations.translateTo(
                'en',
                'i-ate-${bananas}-${when}',
                v,
                'I ate ${bananas} banana(s) for $&{when}'
            );
            expect(t).toBe(expectedEn[i]);
        });
    });

    it('should use key as fallback', () => {
        expect(
            translations.translateTo('en', 'i-ate-${bananas}-${when}', {
                bananas: 3,
                when: 'breakfast',
            })
        ).toBe('i-ate-3-breakfast');
    });
});
