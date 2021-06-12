import { Translations } from '..'

describe('when using wrong in [] operators', () => {
    let operations = [
        //
        'in []',
        'in [1,2,3',
        'in 4]',
    ]
    operations.forEach((v, i) => {
        it(`should throw with wrong array format ${v}`, () => {
            let translations = new Translations({
                en: {
                    'i-ate-${bananas}': {
                        value: 'I ate ${bananas}',
                        plural: {
                            bananas: [[v, 'few bananas']],
                        },
                        description: 'translations',
                    },
                },
            })

            expect(() =>
                translations.translateTo('en', 'i-ate-${bananas}', {
                    bananas: 1,
                })
            ).toThrowError(new Error(`wrong array format: "${v}"`))
        })
    })
})
