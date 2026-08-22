import { Translations } from '..';

describe('Translations public API', () => {
    describe('property fallbacks', () => {
        it('uses a placeholder `?default` from a dictionary entry', () => {
            const translations = new Translations({
                'en-US': { 'hello_${user}': 'Hello ${user?User}!' },
            });

            expect(translations.translateTo('en-US', 'hello_${user}', { user: undefined! })).toBe('Hello User!');
        });

        it('uses a placeholder `?default` from a fallback value', () => {
            const translations = new Translations({});

            expect(
                translations.translateTo('en-US', 'hello_{user}', { user: undefined! }, 'Hello ${user?Friend}!')
            ).toBe('Hello Friend!');
        });
    });

    describe('placeholder prefixes', () => {
        const translations = new Translations(
            {
                'en-US': {
                    hello_user: 'Hello $&{user}!', // insert the prop, then translate the result
                    hello_user_t: 'Hello &{user}!', // translate the literal placeholder name
                    hello_user_r: 'Hello ${user}!', // insert the prop as-is
                    oleg: 'Oleg',
                    user: 'User',
                },
            },
            { lang: 'en-US' }
        );

        it.each([
            { key: 'hello_user', prefix: '$&', expected: 'Hello Oleg!' },
            { key: 'hello_user_t', prefix: '&', expected: 'Hello User!' },
            { key: 'hello_user_r', prefix: '$', expected: 'Hello oleg!' },
        ])('"$prefix{user}" with user="oleg" → "$expected"', ({ key, expected }) => {
            expect(translations.translate(key, { user: 'oleg' })).toBe(expected);
        });
    });

    describe('falling back to another language', () => {
        let translations: Translations;

        beforeEach(() => {
            translations = new Translations(
                {
                    'en-US': {
                        'hello_${user}': 'Hello ${user?User}!',
                        'goodbye_${user}': 'Goodbye $&{user?User}!',
                    },
                    'ru-RU': {
                        'hello_${user}': 'Привет, $&{user?User}!',
                        User: 'Пользовтель',
                        Oleg: 'Олег',
                    },
                },
                { lang: 'ru-RU', fallbackLang: 'en-US' }
            );
        });

        it('translates from the active lang and resolves its placeholders there', () => {
            expect(translations.translate('hello_${user}', { user: 'Oleg' })).toBe('Привет, Олег!');
        });

        it('resolves a `?default` placeholder in the active lang', () => {
            expect(translations.translate('hello_${user}', {})).toBe('Привет, Пользовтель!');
        });

        it('takes the entry from the fallback lang but the placeholder from the active one', () => {
            expect(translations.translate('goodbye_${user}', { user: 'Oleg' }, 'Bye ${user?User}')).toBe(
                'Goodbye Олег!'
            );
        });

        it('uses the given fallback value when neither lang has the key', () => {
            expect(
                translations.translate('nice_day_${user}', { user: undefined! }, 'Have a nice day ${user?Friend}')
            ).toBe('Have a nice day Friend');
        });
    });

    describe('pluralized placeholders that reference other entries', () => {
        const KEY = 'i-ate-apples-for';
        const translations = new Translations(
            {
                'en-US': {
                    [KEY]: {
                        value: 'I ate ${apples} for $&{when}',
                        plural: {
                            apples: [
                                ['= 1', '&{$#-only} apple'], // `$#` is the number, so this is `1-only`
                                ['in [2,3]', '&{$#} apples'], // translates the number itself
                                ['= 5', '$# ($&{yay}) apples'], // translates whatever `yay` points at
                                ['% 11', '$# (divisible by eleven) apples'],
                                ['_', '$# apple(s)'],
                            ],
                        },
                    },
                    dinner: 'Dinner',
                    breakfast: 'Breakfast',
                    '1-only': 'Only One',
                    1: 'One',
                    2: 'Two',
                    3: 'Three',
                    wow: 'WOW!',
                },
            },
            { lang: 'en-US' }
        );

        it.each([
            { props: { apples: 1, when: 'dinner' }, expected: 'I ate Only One apple for Dinner' },
            { props: { apples: 2, when: 'breakfast' }, expected: 'I ate Two apples for Breakfast' },
            { props: { apples: 4, when: 'breakfast' }, expected: 'I ate 4 apple(s) for Breakfast' },
            {
                props: { apples: 121, when: 'dinner' },
                expected: 'I ate 121 (divisible by eleven) apples for Dinner',
            },
            {
                props: { apples: 5, when: 'breakfast', yay: 'wow' },
                expected: 'I ate 5 (WOW!) apples for Breakfast',
            },
        ])('$props.apples apples → "$expected"', ({ props, expected }) => {
            expect(translations.translate(KEY, props)).toBe(expected);
        });
    });

    describe('hasTranslation', () => {
        const translations = new Translations(
            {
                en: { one: 'One', two: { two: 'Two' } },
                gb: { one: 'One', two: { two: 'Two' } },
            },
            { lang: 'en' }
        );

        it.each([
            { key: 'one', expected: true },
            { key: 'two.two', expected: true },
            { key: 'three', expected: false },
            { key: 'four.four', expected: false },
        ])('hasTranslation("$key") is $expected in the active lang', ({ key, expected }) => {
            expect(translations.hasTranslation(key)).toBe(expected);
        });

        it.each([
            { key: 'one', expected: true },
            { key: 'two.two', expected: true },
            { key: 'three', expected: false },
            { key: 'four.four', expected: false },
        ])('hasTranslationTo("gb", "$key") is $expected', ({ key, expected }) => {
            expect(translations.hasTranslationTo('gb', key)).toBe(expected);
        });
    });
});
