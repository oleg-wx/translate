import { Translations } from '..'

describe('when using wrong between operators', () => {
    let operations = [
        'between ',
        'between a and b',
        'between 3-4',
        'between 1 4',
    ]
    operations.forEach((v, i) => {
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
        it(`should throw with "${v}" operator`, () => {
            expect(() =>
                translations.translateTo('en', 'i-ate-${bananas}', {
                    bananas: 1,
                })
            ).toThrowError(new Error(`wrong between format: "${v}"`))
        })
    })
})
