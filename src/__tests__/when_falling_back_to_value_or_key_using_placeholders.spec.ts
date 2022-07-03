import { DictionaryEntry, Translations } from '..';
describe('when falling back to value or key using placeholders', () => {
    let translations = new Translations({
        en: {},
    });

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

    it('should use key as fallback', () => {
        expect(
            translations.translate('i-ate-${bananas}-${when}', {
                bananas: 3,
                when: 'breakfast',
            })
        ).toBe('i-ate-3-breakfast');
    });

    it('should use entry as fallback', () => {
        expect(
            translations.translateTo(
                'en',
                'i-ate',
                {
                    bananas: 5,
                },
                {
                    value: 'i ate ${bananas}',
                    plural: { bananas: [['=5', 'five bananas']] },
                }
            )
        ).toBe('i ate five bananas');
    });

    it('should use entry as fallback', () => {
        expect(
            translations.translate(
                'i-ate',
                {
                    bananas: 5,
                },
                <DictionaryEntry>{
                    value: 'i ate ${bananas}',
                    plural: { bananas: [['=5', 'five bananas']] },
                }
            )
        ).toBe('i ate five bananas');
    });

    it('should fail to fallback to not latin because of REGEXP', () => {
        const res = translations.translateTo(
            'ru-RU',
            'hi_${user}',
            { user: 'Олег' },
            'Привет ${user?Пользователь}'
        );
        expect(res).toBe('Привет ${user?Пользователь}');
    });

    it('should not fallback to property name', () => {
        const res = translations.translateTo(
            'ru-RU',
            'hi_${user}',
            { user: undefined },
            'Привет ${user}'
        );
        expect(res).toBe('Привет ');
    });

    it('should not fallback to property fallback and translate', () => {
        translations.extendDictionary('ru-RU', {
            user: 'Пользователь',
        });
        const res = translations.translateTo(
            'ru-RU',
            'hi_${user}',
            { user: undefined },
            'Привет $&{user?user}'
        );
        expect(res).toBe('Привет Пользователь');
    });
});
