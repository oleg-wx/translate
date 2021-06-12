import { Translations } from '..'

describe('when just adding many params', () => {
    let lang = 'en'
    let key = 'clean-${numberOfRooms}-rooms-at-${numberOfFloors}'
    let translations = new Translations(
        {
            [lang]: {
                [key]: {
                    value: 'clean ${numberOfRooms} at ${numberOfFloors}.',
                    plural: {
                        numberOfRooms: [['= 0', 'no rooms']],
                    },
                    description: 'blah',
                },
            },
        },
        { cacheDynamic: true }
    )

    let values = [
        {
            numberOfRooms: 0,
            numberOfFloors: 3,
        },
        {
            numberOfRooms: 1,
            numberOfFloors: 2,
        },
    ]

    let expected = [
        'clean no rooms at 3.',
        'clean 1 at 2.',
    ]

    beforeEach(() => {})

    values.forEach((v, i) => {
        it('should just translate to: ' + expected[i], () => {
            expect(translations.translateTo(lang, key, v)).toBe(expected[i])
        })
    })
})
