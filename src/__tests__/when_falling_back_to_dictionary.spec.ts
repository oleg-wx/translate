import { Translations } from '..';
describe.only('when falling back to dictionary', () => {
    let translations!: Translations;

    let values = [
        {
            key: 'hello_world',
        },
        {
            key: 'goodbye_world',
        },
        {
            key: 'hello_user',
        },
        {
            key: 'hello_user',
            value: { user: 'Basil' },
        },
        {
            key: 'goodbye_user',
        },
        {
            key: 'goodbye_user',
            value: { user: 'Basil' },
        },
        {
            key: 'nice_day',
            fallback: 'Nice Day',
        },
    ];

    let expected = [
        'Привет, мир!',
        'Goodbye World!',
        'Hello Пользователь',
        'Hello Василий',
        'Пока, Пользователь',
        'Пока, Василий',
        'Nice Day',
    ];

    beforeEach(() => {
        translations = new Translations(
            {
                en: {
                    hello_world: 'Hello World!',
                    goodbye_world: 'Goodbye World!',
                    hello_user: 'Hello $&{user?user_def}',
                    goodbye_user: 'Goodbye $&{user?user_def}',
                    user_def: 'User',
                    user: {
                        authenticated: 'Authenticated',
                        authorized: 'Authorized',
                    },
                    main: {
                        theme: 'Theme',
                        no: {
                            nothing: {
                                value: 'test',
                            },
                        },
                    },
                },
                ru: {
                    hello_world: 'Привет, мир!',
                    goodbye_user: 'Пока, $&{user?user_def}',
                    user_def: 'Пользователь',
                    Basil: 'Василий',
                    user: {
                        authenticated: 'Аутентифицирован',
                    },
                },
            },
            { cacheDynamic: true, lang: 'ru', fallbackLang: 'en' }
        );
    });

    values.forEach((v, i) => {
        it(`should fallback to dictionary for specific terms ${expected[i]}`, () => {
            expect(translations.translate(v.key, v.value, v.fallback)).toBe(
                expected[i]
            );
        });
    });

    it('should fallback to dictionary for absent term in namespace', () => {
        expect(translations.translate('user.authorized')).toBe('Authorized');
    });

    it('should fallback to dictionary for absent namespace', () => {
        expect(translations.translate('main.theme')).toBe('Theme');
    });

    it('should fallback to value absent value in namespace', () => {
        expect(translations.translate('main.no', 'Fallback')).toBe('Fallback');
    });

    it('should contain cached translations for main language only', () => {
        translations.translate('hello_user', { user: 'Basil' });
        translations.translate('hello_user', { user: 'Basil' });
        translations.translate('hello_user', { user: 'Ivan' });
        translations.translate('not_hello_user', { user: 'Ivan' });
        expect(Object.keys(translations.dynamicCache['ru']).length).toBe(2);
        expect(translations.dynamicCache['en']).toBeUndefined();
    });
});
