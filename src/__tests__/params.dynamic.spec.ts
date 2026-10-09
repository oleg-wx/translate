import { Translations } from '..';

const KEY = 'i-ate-${bananas}-${when}';

const translations = new Translations(
    {
        en: {
            [KEY]: { value: 'I ate ${bananas} banana(s) for $&{when}' },
            dinner: 'Dinner',
            breakfast: 'Breakfast',
        },
        ru: {
            [KEY]: { value: 'Я съел ${bananas} банан(а/ов) на $&{when}' },
            dinner: 'ужин',
            breakfast: 'завтрак',
        },
    },
    { lang: 'en' }
);

// `${bananas}` is inserted as-is while `$&{when}` is looked up in the target language.
const CASES = [
    {
        props: { bananas: 0, when: 'dinner' },
        en: 'I ate 0 banana(s) for Dinner',
        ru: 'Я съел 0 банан(а/ов) на ужин',
    },
    {
        props: { bananas: 3, when: 'breakfast' },
        en: 'I ate 3 banana(s) for Breakfast',
        ru: 'Я съел 3 банан(а/ов) на завтрак',
    },
];

describe('when using dynamic parameters', () => {
    it.each(CASES)('translate() uses the default lang → "$en"', ({ props, en }) => {
        expect(translations.translate(KEY, props)).toBe(en);
    });

    it.each(CASES)('translateTo() overrides it → "$ru"', ({ props, ru }) => {
        expect(translations.translateTo('ru', KEY, props)).toBe(ru);
    });
});
