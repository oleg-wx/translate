import { Dictionaries, Translations } from '..';

const KEY = 'i-ate-${eggs}-${bananas}-dinner';

const DICTIONARIES: Dictionaries = {
    en: {
        [KEY]: {
            value: 'I ate ${bananas} and ${eggs} for dinner',
            plural: {
                bananas: [
                    ['= 1 ', 'one banana'],
                    ['in [2,3,4]', '$# bananas'],
                    ['< 1', 'no bananas'],
                    ['% 11', 'many bananas that is divisible by eleven'],
                    ['> 10', 'too many bananas'],
                    ['>= 5', 'many bananas'],
                    ['_', '$# bananas'],
                ],
                eggs: [
                    ['= 0', 'zero eggs'],
                    ['= 1', 'one egg'],
                    ['_', '$# eggs'],
                ],
            },
            description: 'translations',
        },
    },
    ru: {
        [KEY]: {
            value: 'Я съел ${bananas} и ${eggs} на обед',
            plural: {
                bananas: [
                    ['= 1', 'один банан'],
                    ['< 1', 'нуль бананов'],
                    ['in [2,3,4]', '$# банана'],
                    ['% 11', 'много бананов (делимое на 11)'],
                    ['> 10', 'слишком много бананов'],
                    ['> 5', 'много бананов'],
                    ['_', '$# бананов'],
                ],
                eggs: [
                    ['= 0', 'нуль яиц'],
                    ['= 1', 'одно яйцо'],
                    ['= 2', 'два яйца'],
                    ['in [3,4]', '$# яйца'],
                    ['_', '$# яйц'],
                ],
            },
            description: 'translations',
        },
    },
};

/** A fresh instance per test, so the suites below can set `lang` without leaking into each other. */
const createTranslations = () => new Translations(DICTIONARIES);

/**
 * One row per input, holding every expectation for it:
 * the EN and RU translations plus the key that is echoed back when no language is set.
 */
const CASES = [
    {
        props: { bananas: 0, eggs: 3 },
        en: 'I ate no bananas and 3 eggs for dinner',
        ru: 'Я съел нуль бананов и 3 яйца на обед',
        untranslated: 'i-ate-3-0-dinner',
    },
    {
        props: { bananas: 1, eggs: 2 },
        en: 'I ate one banana and 2 eggs for dinner',
        ru: 'Я съел один банан и два яйца на обед',
        untranslated: 'i-ate-2-1-dinner',
    },
    {
        props: { bananas: 3, eggs: 4 },
        en: 'I ate 3 bananas and 4 eggs for dinner',
        ru: 'Я съел 3 банана и 4 яйца на обед',
        untranslated: 'i-ate-4-3-dinner',
    },
    {
        props: { bananas: 10, eggs: 0 },
        en: 'I ate many bananas and zero eggs for dinner',
        ru: 'Я съел много бананов и нуль яиц на обед',
        untranslated: 'i-ate-0-10-dinner',
    },
    {
        props: { bananas: 121, eggs: 1 },
        en: 'I ate many bananas that is divisible by eleven and one egg for dinner',
        ru: 'Я съел много бананов (делимое на 11) и одно яйцо на обед',
        untranslated: 'i-ate-1-121-dinner',
    },
    {
        props: { bananas: 12, eggs: 1 },
        en: 'I ate too many bananas and one egg for dinner',
        ru: 'Я съел слишком много бананов и одно яйцо на обед',
        untranslated: 'i-ate-1-12-dinner',
    },
];

const TITLE = '$props.bananas bananas and $props.eggs eggs';

describe('when translating pluralized values to 2 langs', () => {
    describe('translateTo(lang, ...) picks the language explicitly', () => {
        it.each(CASES)(`${TITLE} → EN`, ({ props, en }) => {
            expect(createTranslations().translateTo('en', KEY, props)).toBe(en);
        });

        it.each(CASES)(`${TITLE} → RU`, ({ props, ru }) => {
            expect(createTranslations().translateTo('ru', KEY, props)).toBe(ru);
        });
    });

    describe('translate(...) uses the language set on the instance', () => {
        it.each(CASES)(`${TITLE} → EN`, ({ props, en }) => {
            const translations = createTranslations();
            translations.lang = 'en';

            expect(translations.translate(KEY, props)).toBe(en);
        });

        it.each(CASES)(`${TITLE} → RU`, ({ props, ru }) => {
            const translations = createTranslations();
            translations.lang = 'ru';

            expect(translations.translate(KEY, props)).toBe(ru);
        });
    });

    describe('translate(...) with no language falls back to the key', () => {
        it.each(CASES)(`${TITLE} → "$untranslated"`, ({ props, untranslated }) => {
            const translations = createTranslations();

            expect(translations.lang).toBeUndefined();
            expect(translations.translate(KEY, props)).toBe(untranslated);
        });
    });
});
