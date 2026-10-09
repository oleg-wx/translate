import { DictionaryEntry, Translations } from '..';

const LANG = 'en';
const KEY_WITH_PLACEHOLDERS = 'i-ate-${bananas}-${when}';

/** Every test starts from empty dictionaries, so nothing can ever be translated outright. */
const createTranslations = () => new Translations({ [LANG]: {} });

describe('when falling back to a value', () => {
    it.each([
        { props: { bananas: 0, when: 'dinner' }, expected: 'I ate 0 banana(s) for dinner' },
        { props: { bananas: 3, when: 'breakfast' }, expected: 'I ate 3 banana(s) for breakfast' },
    ])('fills the fallback value placeholders → "$expected"', ({ props, expected }) => {
        const translated = createTranslations().translateTo(
            LANG,
            KEY_WITH_PLACEHOLDERS,
            props,
            'I ate ${bananas} banana(s) for $&{when}'
        );

        expect(translated).toBe(expected);
    });

    const ENTRY_FALLBACK: DictionaryEntry = {
        value: 'i ate ${bananas}',
        plural: { bananas: [['=5', 'five bananas']] },
    };

    it('accepts a whole entry, plurals included, via translateTo', () => {
        const translated = createTranslations().translateTo(LANG, 'i-ate', { bananas: 5 }, ENTRY_FALLBACK);

        expect(translated).toBe('i ate five bananas');
    });

    it('accepts a whole entry, plurals included, via translate', () => {
        const translated = createTranslations().translate('i-ate', { bananas: 5 }, ENTRY_FALLBACK);

        expect(translated).toBe('i ate five bananas');
    });
});

describe('when falling back to the key itself', () => {
    it('fills the key placeholders via translateTo', () => {
        const translated = createTranslations().translateTo(LANG, KEY_WITH_PLACEHOLDERS, {
            bananas: 3,
            when: 'breakfast',
        });

        expect(translated).toBe('i-ate-3-breakfast');
    });

    it('fills the key placeholders via translate', () => {
        const translated = createTranslations().translate(KEY_WITH_PLACEHOLDERS, {
            bananas: 3,
            when: 'breakfast',
        });

        expect(translated).toBe('i-ate-3-breakfast');
    });
});

describe('when a fallback value contains non-latin placeholders', () => {
    it('leaves the placeholder untouched, because the placeholder regexp is latin-only', () => {
        const translated = createTranslations().translateTo(
            'ru-RU',
            'hi_${user}',
            { user: 'Олег' },
            'Привет ${user?Пользователь}'
        );

        expect(translated).toBe('Привет ${user?Пользователь}');
    });

    it('does not fall back to the property name when the value is undefined', () => {
        const translated = createTranslations().translateTo(
            'ru-RU',
            'hi_${user}',
            { user: undefined },
            'Привет ${user}'
        );

        expect(translated).toBe('Привет ');
    });

    it('translates the property fallback when asked to with `$&`', () => {
        const translations = createTranslations();
        translations.extendDictionary('ru-RU', { user: 'Пользователь' });

        const translated = translations.translateTo(
            'ru-RU',
            'hi_${user}',
            { user: undefined },
            'Привет $&{user?user}'
        );

        expect(translated).toBe('Привет Пользователь');
    });
});
