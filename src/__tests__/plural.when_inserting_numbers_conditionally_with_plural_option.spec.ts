import { Translations } from '..'
describe('when inserting numbers conditionally with plural options', () => {
    let key = 'i-ate-${eggs}-${bananas}-dinner'
    let translations = new Translations({
        en: {
            [key]: {
                value: 'I ate ${bananas} for dinner',
                plural: {
                    bananas: [
                        ['= 1', 'one banana'],
                        ['in [2,3]', '$# bananas'],
                        ['between 4 and 6', '4-6 bananas'],
                        ['< 1', 'no bananas'],
                        ['<= 8', 'few bananas'],
                        ['> 12', 'too many bananas'],
                        ['>= 10', 'several bananas'],
                        ['_', 'about $# bananas'],
                    ],
                },
                description: 'translations',
            },
        },
    })

    let values = [
        { bananas: 1 },
        { bananas: 2 },
        { bananas: 3 },
        { bananas: 4 },
        { bananas: 5 },
        { bananas: 6 },
        { bananas: 0 },
        { bananas: -1 },
        { bananas: 7 },
        { bananas: 8 },
        { bananas: 13 },
        { bananas: 10 },
        { bananas: 11 },
        { bananas: 12 },
        { bananas: 9 },
    ]

    let expectedEn = [
        'I ate one banana for dinner',
        'I ate 2 bananas for dinner',
        'I ate 3 bananas for dinner',
        'I ate 4-6 bananas for dinner',
        'I ate 4-6 bananas for dinner',
        'I ate 4-6 bananas for dinner',
        'I ate no bananas for dinner',
        'I ate no bananas for dinner',
        'I ate few bananas for dinner',
        'I ate few bananas for dinner',
        'I ate too many bananas for dinner',
        'I ate several bananas for dinner',
        'I ate several bananas for dinner',
        'I ate several bananas for dinner',
        'I ate about 9 bananas for dinner',
    ]

    values.forEach((v, i) => {
        it(`should build ${v.bananas} => ${expectedEn[i]}`, () => {
            expect(translations.translateTo('en', key, v)).toBe(expectedEn[i])
        })
    })
})
