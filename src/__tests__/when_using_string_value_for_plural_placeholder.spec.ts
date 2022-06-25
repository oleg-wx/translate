import { Translations } from '..'

describe('when using string value for plural placeholder', () => {
    let translations = new Translations({
        en: {
            days: {
                value: 'it is more then ${days}',
                plural: {
                    days: [
                        ['>90', 'three months'],
                        ['_', '$# days'],
                    ],
                },
            },
        },
    })
    translations.lang = 'en'

    let values = [{ days: 90 }, { days: 100 }, { days: 'blabla' }]

    let expected = [
        'it is more then 90 days',
        'it is more then three months',
        'it is more then blabla',
    ]
    values.forEach((v, i) => {
        it(`should replace plural placeholder with ${v.days}`, () => {
            expect(translations.translate('days', v)).toBe(expected[i])
        })
    })
})
