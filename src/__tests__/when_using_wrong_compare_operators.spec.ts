import { Translations } from '..'

describe('when using wrong conpare operators', () => {
    let operations = [
        //
        '<=',
        '0',
        '>',
        '==',
        '[1,2,3]',
        '+',
        '> a',
        'doit()',
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
            ).toThrowError(new Error(`operator "${v}" not supported`))
        })
    })
})
