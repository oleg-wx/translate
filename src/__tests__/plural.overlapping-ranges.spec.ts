import { Translations } from '..';

const KEY = 'days';

const translations = new Translations(
    {
        en: {
            [KEY]: {
                value: 'it is more then ${days}',
                plural: {
                    days: [
                        ['>183', 'half of year'],
                        ['>93', 'three months'], // only reached by 94..183, the wider rule above wins first
                        ['_', '$# days'],
                    ],
                },
            },
        },
    },
    { lang: 'en' }
);

describe('when plural ranges overlap', () => {
    it.each([
        { days: 10, plural: '10 days' },
        { days: 90, plural: '90 days' },
        { days: 94, plural: 'three months' },
        { days: 100, plural: 'three months' },
        { days: 200, plural: 'half of year' },
    ])('$days days → "it is more then $plural"', ({ days, plural }) => {
        expect(translations.translate(KEY, { days })).toBe(`it is more then ${plural}`);
    });
});
