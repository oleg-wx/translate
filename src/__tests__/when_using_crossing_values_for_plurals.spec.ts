import { Translations } from '..'

describe('when using string value for plural placeholder', () => {
    let key = 'days'
    let translations = new Translations({
        en: {
            [key]: {
                value: 'it is more then ${days}',
                plural: {
                    days: [
                        ['>183', 'half of year'],
                        ['>93', 'three months'],
                        ['_', '$# days'],
                    ],
                },
            },
        },
    })
    translations.lang = 'en'

    let values = [
        { days: 10 },
        { days: 100 },
        { days: 200 },
        { days: 94 },
        { days: 90 },
    ]

    let expected = [
        'it is more then 10 days',
        'it is more then three months',
        'it is more then half of year',
        'it is more then three months',
        'it is more then 90 days',
    ]
    values.forEach((v, i) => {
        it(`should replace plural placeholder with ${v.days}`, () => {
            expect(translations.translate(key, v)).toBe(expected[i])
        })
    })
})
