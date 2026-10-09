import { Translations } from '..';

const KEY = 'days';

const translations = new Translations(
    {
        en: {
            [KEY]: {
                value: 'it is more then ${days}',
                plural: {
                    days: [
                        ['>90', 'three months'],
                        ['_', '$# days'],
                    ],
                },
            },
        },
    },
    { lang: 'en' }
);

describe('when using a string value for a plural placeholder', () => {
    it.each([
        { days: 90, plural: '90 days' },
        { days: 100, plural: 'three months' },
        // A non-numeric value matches no comparison, so the default rule inserts it verbatim.
        { days: 'blabla', plural: 'blabla' },
    ])('$days → "it is more then $plural"', ({ days, plural }) => {
        expect(translations.translate(KEY, { days })).toBe(`it is more then ${plural}`);
    });
});
