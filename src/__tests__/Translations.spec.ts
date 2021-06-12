import { Translations } from "..";


test('Fallback Property in Dictionary', () => {
    const dics = {
        'en-US': {
            'hello_${user}': 'Hello ${user?User}!',
        },
    }
    const translations = new Translations(dics)
    const translated = translations.translateTo('en-US', 'hello_${user}', {
        user: undefined!,
    })
    expect(translated).toBe('Hello User!')
})

test('Fallback Property in Fallback :) Value', () => {
    const translations = new Translations({})
    const translated = translations.translateTo(
        'en-US',
        'hello_{user}',
        { user: undefined! },
        'Hello ${user?Friend}!'
    )
    expect(translated).toBe('Hello Friend!')
})

test('Fallback with dictionary', () => {
    debugger
    const dics = {
        'en-US': {
            'hello_${user}': 'Hello ${user?User}!',
            'goodbye_${user}': 'Goodbye $&{user?User}!',
        },
        'ru-RU': {
            'hello_${user}': 'Привет, $&{user?User}!',
            User: 'Пользовтель',
            Oleg: 'Олег',
        },
    }
    const translations = new Translations(dics, {
        defaultLang: 'ru-RU',
        fallbackLang: 'en-US',
    })

    expect(translations.translate('hello_${user}', { user: 'Oleg' })).toBe(
        'Привет, Олег!'
    )
    expect(
        translations.translate(
            'goodbye_${user}',
            { user: 'Oleg' },
            'Bye ${user?User}'
        )
    ).toBe('Goodbye Олег!')

    expect(translations.translate('hello_${user}', {})).toBe(
        'Привет, Пользовтель!'
    )
    expect(
        translations.translate(
            'nice_day_${user}',
            { user: undefined! },
            'Have a nice day ${user?Friend}'
        )
    ).toBe('Have a nice day Friend')
})

it('should replace items correctly in different ways', () => {
    const dics = {
        'en-US': {
            hello_user: 'Hello $&{user}!',
            hello_user_t: 'Hello &{user}!',
            hello_user_r: 'Hello ${user}!',
            oleg: 'Oleg',
            user: 'User',
        },
    }
    const translations = new Translations(dics, { defaultLang: 'en-US' })
    translations.defaultLang = 'en-US'
    expect(translations.translate('hello_user', { user: 'oleg' })).toBe(
        'Hello Oleg!'
    )
    expect(translations.translate('hello_user_t', { user: 'oleg' })).toBe(
        'Hello User!'
    )
    expect(translations.translate('hello_user_r', { user: 'oleg' })).toBe(
        'Hello oleg!'
    )
})

test('Namespaces', () => {
    let translations = new Translations(
        {
            'en-US': {
                'i-ate-apples-for': {
                    value: 'I ate ${apples} for $&{when}',
                    plural: {
                        apples: [
                            ['= 1', '&{$#-only} apple'],
                            ['in [2,3]', '&{$#} apples'],
                            ['= 5', '$# ($&{yay}) apples'],
                            ['_', '$# apple(s)'],
                        ],
                    },
                },
                dinner: 'Dinner',
                breakfast: 'Breakfast',
                '1-only': 'Only One',
                1: 'One',
                2: 'Two',
                3: 'Three',
                wow: 'WOW!',
            },
        },
        {
            defaultLang: 'en-US',
        }
    )
    expect(
        translations.translate('i-ate-apples-for', {
            apples: 1,
            when: 'dinner',
        })
    ).toBe('I ate Only One apple for Dinner')
    expect(
        translations.translate('i-ate-apples-for', {
            apples: 2,
            when: 'breakfast',
        })
    ).toBe('I ate Two apples for Breakfast')
    expect(
        translations.translate('i-ate-apples-for', {
            apples: 4,
            when: 'breakfast',
        })
    ).toBe('I ate 4 apple(s) for Breakfast')
    expect(
        translations.translate('i-ate-apples-for', {
            apples: 5,
            when: 'breakfast',
            yay: 'wow',
        })
    ).toBe('I ate 5 (WOW!) apples for Breakfast')
})
