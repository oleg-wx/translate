# Simply Translate

Simplest translations for JS. Consider it even more as a object mapper, a Dictionary, not translation AI or Bot or something... :)

## **Breaking changes**
#### (v0.10.0) 
-   `$T{...}` replaced with `$&{...}`.
-   `{$}` and `$T{$}` removed from **pluralization**, use `$#` instead _(see [Plural translations](#Plural-translations))_.

---

### Install

```javascript
npm i simply-translate
```

### Import

```javascript
import { Translations } from 'simply-translate'
```

_Typescript_ (4.0) supported

### Initialize

translations with dictionaries

```javascript
// create translations with dictionary and storing dynamically translated values:
const dics = {...};
const translations = new Translations(dics, {cacheDynamic: true});
```

### Dictionaries

JSON with languge identifier in the root

```javascript
const dics = {
  "en-US": ...,
  "ru-RU": ...
};
```

### Dictionary entry

is a set of values with a unique string as a key and a string or object with value (which is requierd) and description

```javascript
const dics = {
    'en-US': {
        hello_world: 'Hello World',
        goodbye_world: {
            value: 'Goodbye World',
            description: 'When you want to say goodbye to the world',
        },
    },
}
```

### Translate

by calling `translate` or `translateTo` functions.    
`translate` function uses `defaultLang` property, `translateTo` awaits language parameter.

```javascript
// create translations with dictionary:
const translations = new Translations({...}, {cacheDynamic: true, defaultLang:'en-US'});
const translated = translations.translate('hello_world');
const translated = translations.translateTo('en-US', 'hello_world');
```

To use dynamic data that can be passed to as parameters for translation add `${...}` with property name of the passed data.

```javascript
const dics = {
    'en-US': {
        hello_user: 'Hello ${user}!',
    },
}
const translations = new Translations(dics, { defaultLang: 'en-US' })
translations.translate('hello_user', { user: 'Oleg' })
// Hello Oleg!
```

Please note: _starting from v0.0.7 it is required to add $ before placeholders_. It is still possible to use _$-less_ placeholders by setting `$less` property of `Translations` to `true`, however it is _not recommended_.

```javascript
const dics = {
  "en-US": {
    hello_user: "Hello {user}!",
  },
};
const translations = new Translations(dics, { defaultLang: "en-US", $less = true });
// or
translations.$less = true;

translations.translate("hello_user", { user: "Oleg" }, "Hello {user}");
// Hello Oleg
```

Please _note_ that using `$` prefix will replace placeholder with value from the data object, `$&` will try to translate that value, and `&` will just translate the placeholder.

```javascript
const dics = {
    'en-US': {
        hello_user: 'Hello $&{user}!',
        hello_user_t: 'Hello &{user}!',
        hello_user_r: 'Hello ${user}!',
        oleg: 'Oleg',
        user: 'User'
    },
}
const translations = new Translations(dics, { defaultLang: "en-US" });
translations.translate('hello_user', { user: 'oleg' });
// Hello Oleg!
translations.translate('hello_user_t', { user: 'oleg' });
// Hello User!
translations.translate('hello_user_r', { user: 'oleg' });
// Hello oleg!
```

### Namespaces

You can group items in dictionary by a _namespace_, which is basically just an object.

```javascript
const dics = {
  "en-US": {
    user:{
      hello_user: "Hello ${user}!",
    }
  },
};
const translations = new Translations(dics, { defaultLang: "en-US" });
translations.translate(["user","hello_user"], { user: "Oleg" });
// Hello Oleg!
translations.translate("user:hello_user"], { user: "Oleg" });
// Hello Oleg!
```

### Fallback value

can be passed to `translate` function to be shown instead of absent translation.

```javascript
const dics = {
    'en-US': {
        hello_world: 'Hello World',
    },
}
const translations = new Translations(dics, { defaultLang: 'en-US' })
translations.translate('hello_${user}', { user: 'Oleg' }, 'Hello ${user}')
// Hello Oleg!
```

To add clarity you can use `${...}` in keys, **however** it is **not** required.

```javascript
const dics = {
    'en-US': {
        'hello_${user}': 'Hello ${user}!',
    },
}
const translations = new Translations(dics)
translations.translateTo('en-US', 'hello_${user}', { user: 'Oleg' })
// Hello Oleg!
```

It may be useful if translation and fallback values were not provided, so key will be used with dynamic value.

```javascript
translations.translateTo('es-ES', 'hello_${user}', { user: 'Oleg' })
// hello_Oleg!
```

It is possible to use fallback values for dynamic parameters. **Note**: Due to some limitations **only Latin** characters supported for fallback.

```javascript
const dics = {
    'en-US': {
        'hello_${user}': 'Hello ${user?User}!',
    },
}
const translations = new Translations(dics, { defaultLang: 'en-US' })

translations.translate('hello_${user}', { user: undefined })
// Hello User!
translations.translate('hi_${user}', { user: undefined }, 'Hi ${user?Friend}')
// Hi Friend!
```

Next will fail to replace placeholder:

```javascript
translations.translateTo(
    'ru-RU',
    'hi_${user}',
    { user: 'Олег' },
    'Привет ${user?Пользователь}'
)
// Привет ${user?Пользователь}
```

To solve this you may add translation term:

```javascript
translations.extendDictionary('ru-RU', {
    User: 'Пользователь',
})
translations.translateTo(
    'ru-RU',
    'hi_${user}',
    { user: undefined },
    'Привет $&{user?User}'
)
// Привет Пользователь
```

### Fallback language

You can use fallback if dictionary for passed or selected language does not contain translation. Fallback dictionary will be used before fallback value.

```javascript
const dics = {
    'en-US': {
        'hello_${user}': 'Hello ${user?User}!',
        'goodbye_${user}': 'Goodbye ${user?User}!',
    },
    'ru-RU': {
        'hello_${user}': 'Привет, $&{user}!',
        user: 'Пользовтель',
        Oleg: 'Олег',
    },
}
const translations = new Translations(dics, {
    defaultLang: 'ru-RU',
    fallbackLang: 'en-US',
})

translations.translate('hello_${user}', { user: 'Oleg' })
// Привет, Олег!
translations.translate('goodbye_${user}', { user: 'Oleg' }, 'Bye ${user?User}')
// Goodbye Oleg!
translations.translate(
    'nice_day_${user}',
    { user: undefined },
    'Have a nice day ${user?Friend}'
)
// Have a nice day Friend
```

### Pluralization

As this is Simple translation library, it works with pluralization in the simple way as well. Use `$#` in plural options to insert number.

```javascript
let translations = new Translations(
    {
        'en-US': {
            'i-ate-eggs-bananas-dinner': {
                value: 'I ate ${bananas} and ${eggs} for dinner',
                plural: {
                    bananas: [
                        ['<= 0', 'no bananas'],
                        ['= 1', 'one banana'],
                        ['in [3,4]', 'few bananas'],
                        ['> 10', 'too many bananas'],
                        ['>= 5', 'many bananas'],
                    ],
                    eggs: [
                        ['= 0', 'zero eggs'],
                        ['= 1', 'one egg'],
                        ['between 2 and 4', 'some eggs'],
                        ['_', '$# eggs'],
                    ],
                },
                description: 'translations',
            },
        },
    },
    {
        defaultLang: 'en-US',
    }
)
translations.translate('i-ate-eggs-bananas-dinner', {
    bananas: 0,
    eggs: 1,
})
// I ate no bananas and one egg for dinner
translations.translate('i-ate-eggs-bananas-dinner', {
    bananas: 3,
    eggs: 2,
})
// I ate few bananas and 2 eggs for dinner
translations.translate('i-ate-eggs-bananas-dinner', {
    bananas: 1,
    eggs: 1,
})
// I ate one banana and one egg for dinner
translations.translate('i-ate-eggs-bananas-dinner', {
    bananas: 11,
    eggs: 0,
})
// I ate too many bananas and zero eggs for dinner
translations.translate('i-ate-eggs-bananas-dinner', {
    bananas: 6,
    eggs: 3,
})
// I ate many bananas and some eggs for dinner
```

Pluralization are added to `plural` property of translation value as an array to keep execution order.
The structure of pluralization entry is a tuple: `[operation, value]`.
Translator supports few operators: `>`,`<`,`=`,`<=`,`>=`, `in []`, `between`, and `_` for _default_. Operations can only be done with static numbers provided in `operation`;
Execution order is important because compare operations run from top to bottom and as soon criteria is met translation will use a `value` provided for `operation`.

### Plural translations

_(v0.10.3+)_ In case if dynamic parameters have to be translated you can use `$&{$#}` syntax.  
_(v0.10.3+)_ It is possible to modify plural translations a little bit like so: `$&{my-$#-value}`.  
_(v0.10.3+)_ In rare cases you are able to use dynamic replacement `${...}` placeholders as well.

```javascript
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
translations.translate('i-ate-apples-for', {
    apples: 1,
    when: 'dinner',
})
// I ate Only One apple for Dinner
translations.translate('i-ate-apples-for', {
    apples: 2,
    when: 'breakfast',
})
// I ate Two apples for Breakfast
translations.translate('i-ate-apples-for', {
    apples: 4,
    when: 'breakfast',
})
// I ate 4 apple(s) for Breakfast
translations.translate('i-ate-apples-for', {
    apples: 5,
    when: 'breakfast',
    yay: 'wow',
})
// I ate 4 apple(s) for Breakfast
```

### Add terms to dictionary

To **extend** dictionary with new values use `extendDictionary` method.

```javascript
translations.extendDictionary('en-US', {
    'i-ate-mango': {
        value: 'I ate ${mango}',
        plural: {
            apples: [
                ['< 1', 'no mangos'],
                ['= 1', 'one mango'],
                ['_', '$# mangos'],
            ],
        },
    },
})
```

### Dynamic Cache

As dictionaries are plan JS objects it is not a big deal for engine to get values by a key, but when you add _dynamic values_, translator needs to parse, build, do inner translations etc., so to increase performance you might want to store dynamically translated values in some cache.  
To do so just pass the option to `Translations` constructor like so: `new Translations({...}, {cacheDynamic: true})`. Translations will be cached for dynamic values with unique identifier, more different dynamic values you use, bigger cache becomes, consider this when setting up translations.
