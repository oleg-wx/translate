import { Dictionaries, Translations } from '..';

const DICTIONARIES: Dictionaries = {
    fb: {
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
    main: {
        hello_world: 'Привет, мир!',
        goodbye_user: 'Пока, $&{user?user_def}',
        user_def: 'Пользователь',
        Basil: 'Василий',
        user: {
            authenticated: 'Аутентифицирован',
        },
    },
};

describe('when falling back to the fallback dictionary', () => {
    let translations: Translations;

    beforeEach(() => {
        // Rebuilt per test: `main` is the active language and `fb` fills in whatever it is missing.
        translations = new Translations(JSON.parse(JSON.stringify(DICTIONARIES)), {
            lang: 'main',
            fallbackLang: 'fb',
        });
    });

    it.each([
        // Present in `main`, so no fallback happens.
        { key: 'hello_world', expected: 'Привет, мир!' },
        // Missing from `main` entirely.
        { key: 'goodbye_world', expected: 'Goodbye World!' },
        // Entry comes from `fb`, but its placeholders still resolve against `main`.
        { key: 'hello_user', expected: 'Hello Пользователь' },
        { key: 'hello_user', props: { user: 'Basil' }, expected: 'Hello Василий' },
        // Entry comes from `main`.
        { key: 'goodbye_user', expected: 'Пока, Пользователь' },
        { key: 'goodbye_user', props: { user: 'Basil' }, expected: 'Пока, Василий' },
        // In neither dictionary, so the explicit fallback value wins.
        { key: 'nice_day', fallback: 'Nice Day', expected: 'Nice Day' },
    ])('$key → "$expected"', ({ key, props, fallback, expected }) => {
        expect(translations.translate(key, props, fallback)).toBe(expected);
    });

    it('falls back for a term missing from an existing namespace', () => {
        expect(translations.translate('user.authorized')).toBe('Authorized');
    });

    it('falls back for a namespace missing altogether', () => {
        expect(translations.translate('main.theme')).toBe('Theme');
    });

    it('falls back to the given value when the key resolves to a namespace, not an entry', () => {
        expect(translations.translate('main.no', 'Fallback')).toBe('Fallback');
    });
});
