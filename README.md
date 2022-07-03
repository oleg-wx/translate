# Simply Translate

Simplest translations for JS. Even consider it more as an object mapper, a Dictionary, but not translation AI or Bot or something... :)  
_[Typescript support]_

### **Breaking changes**

#### (v0.20.0)

-   added **middleware pipeline** _(see [Pipeline](#Pipeline))_.
-   added **remainder** (modulo) plural operator `%`.
-   added **ends-with** plural operator `...`.
-   added **cases** functionality _(see [Cases](#Cases))_.
-   added double curly brackets `{{...}}` support for placeholder.
-   deprecated `defaultLang` property over `lang` name.
-   deprecated `$less` property. Instead of `$less` use `placeholder = 'single'`.
-   not falling back to placeholder property name.
-   removed **dynamic cache**.
-   ~~deprecated `fallbackLang` property~~ `fallbackLang` remains.

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
import { Translations } from 'simply-translate';
```

### Initialize

translations with dictionaries

```javascript
// create translations with dictionary and storing dynamically translated values:
const dics = {...};
const translations = new Translations(dics, {lang:'en-US'});
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

is a set of values with a unique string as a key and a string or object with _value_ (which is required), _description_, and (optionally) _plural_ and _cases_ data

```javascript
const dics = {
    'en-US': {
        hello_world: 'Hello World',
        goodbye_world: {
            value: 'Goodbye World',
            description: 'When you want to say goodbye to the world',
        },
    },
};
```

### Translate

by calling `translate` or `translateTo` methods.  
`translate` method uses `lang` property of `Translations`, `translateTo` requires language parameter.

```javascript
// create translations with dictionary:
const translations = new Translations({...}, {lang:'en-US'});
const translated = translations.translate('hello_world');
const translated = translations.translateTo('en-US', 'hello_world');
```

To use dynamic data add `${...}` with field name of the data object.

```javascript
const dics = {
    'en-US': {
        hello_user: 'Hello ${user}!',
    },
};
const translations = new Translations(dics, { lang: 'en-US' });
translations.translate('hello_user', { user: 'Oleg' });
// Hello Oleg!
```

In version _v0.0.20_ `$less` is deprecated. Instead of `$less` use `placeholder = 'single'`.  
It is required to add \$ before placeholders. However it is possible to use _$-less_ placeholders by setting `$placeholder` property of `Translations` to _single_ (`{...}`) or _double_ (`{{...}}`), however it is _not recommended_.

```javascript
const dics = {
  "en-US": {
    hello_user: "Hello {user}!",
  },
};
const translations = new Translations(dics, { lang: "en-US", placeholder = 'single' });

translations.translate("hello_user", { user: "Oleg" }, "Hello {user}");
// Hello Oleg

// or
translations.placeholder = 'double';
translations.translate("hello_user", { user: "Oleg" }, "Hello {{user}}");
// Hello Oleg
```

Please **note** that using `$` prefix will replace placeholder with value from the data object, `$&` will try to translate that value, and `&` will just translate the placeholder.  
And **note**: _single_ (`{...}`) and _double_ ignores `$` as if it is there.

```javascript
const dics = {
    'en-US': {
        hello_user: 'Hello $&{user}!',
        hello_user_t: 'Hello &{user}!',
        hello_user_r: 'Hello ${user}!',
        oleg: 'Oleg',
        user: 'User',
    },
};
const translations = new Translations(dics, { lang: 'en-US' });
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
    'en-US': {
        user: {
            hello_user: 'Hello ${user}!',
        },
    },
};
const translations = new Translations(dics, { lang: 'en-US' });
translations.translate(['user', 'hello_user'], { user: 'Oleg' });
// Hello Oleg!
translations.translate('user.hello_user', { user: 'Oleg' });
// Hello Oleg!
```

Do **not use** namespaces separator (`.`) for dictionary keys.

### Fallback value

Can be used as value if translation was not found. If value is not found and `fallback` is not provided, _key_ will be used as _value_.

```javascript
const dics = {
    'en-US': {
        hello_world: 'Hello World',
    },
};
const translations = new Translations(dics, { lang: 'en-US' });
translations.translate('hello_user}', { user: 'Oleg' }, 'Hello ${user}');
// Hello Oleg!
```

You can use `${...}` in keys, **however** it is **not** required, but might be useful.

```javascript
const dics = {
    'en-US': {
        'hello_${user}': 'Hello ${user}!',
    },
};
const translations = new Translations(dics);
translations.translateTo('en-US', 'hello_${user}', { user: 'Oleg' });
// Hello Oleg!
translations.translateTo('en-US', 'goodbye_${user}', { user: 'Oleg' });
// goodbye_Oleg!
```

It is possible to use fallback values for dynamic fields. **Note**: Due to implementation limitations (and not adding external dependencies) **only Latin** characters supported for placeholders and fallback.  
Since _ver.0.20.0_ if property is null or undefined placeholder will be empty _(not property name as it was)_.

```javascript
const dics = {
    'en-US': {
        'hello_${user}': 'Hello ${user?User}!',
    },
};
const translations = new Translations(dics, { lang: 'en-US' });

translations.translate('hello_${user}', { user: undefined });
// Hello User!
translations.translate('hi_${user}', { user: undefined }, 'Hi ${user?Friend}');
// Hi Friend!
translations.translate('hi_${user}', { user: undefined }, 'Hi ${user}');
// Hi !
```

Next will fail to replace placeholder:

```javascript
translations.translateTo('ru-RU', 'hi_${user}', { user: 'Олег' }, 'Привет ${user?Пользователь}');
// Привет ${user?Пользователь}
```

To solve this you may add translation term:

```javascript
translations.extendDictionary('ru-RU', {
    User: 'Пользователь',
});
translations.translateTo('ru-RU', 'hi_${user}', { user: undefined }, 'Привет $&{user?User}');
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
};
const translations = new Translations(dics, {
    lang: 'ru-RU',
    fallbackLang: 'en-US',
});

translations.translate('hello_${user}', { user: 'Oleg' });
// Привет, Олег!
translations.translate('goodbye_${user}', { user: 'Oleg' }, 'Bye ${user?User}');
// Goodbye Олег!
translations.translate('nice_day_${user}', { user: undefined }, 'Have a nice day ${user?Friend}');
// Have a nice day Friend
```

### Pluralization

Use `$#` in plural options to insert number.

```javascript
let translations = new Translations(
    {
        'en-US': {
            'i-ate-eggs-bananas-dinner': {
                value: 'I ate ${bananas} and ${eggs} for dinner',
                plural: {
                    bananas: [
                        ['<= 0', 'no bananas'],
                        ['...2', 'number of bananas that ends with 2'],
                        ['= 1', 'one banana'],
                        ['in [3,4]', 'few bananas'],
                        ['% 11', 'many bananas that is divisible by eleven'],
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
            },
        },
    },
    {
        lang: 'en-US',
    }
);

translations.translate('i-ate-eggs-bananas-dinner', {
    bananas: 0,
    eggs: 1,
});
// I ate no bananas and one egg for dinner

translations.translate('i-ate-eggs-bananas-dinner', {
    bananas: 3,
    eggs: 5,
});
// I ate few bananas and 5 eggs for dinner

translations.translate('i-ate-eggs-bananas-dinner', {
    bananas: 1,
    eggs: 1,
});
// I ate one banana and one egg for dinner

translations.translate('i-ate-eggs-bananas-dinner', {
    bananas: 13,
    eggs: 0,
});
// I ate too many bananas and zero eggs for dinner

translations.translate('i-ate-eggs-bananas-dinner', {
    bananas: 121,
    eggs: 3,
});
// I ate many bananas that is divisible by eleven and some eggs for dinner

translations.translate('i-ate-eggs-bananas-dinner', {
    bananas: 6,
    eggs: 3,
});
// I ate many bananas and some eggs for dinner

translations.translate('i-ate-eggs-bananas-dinner', {
    bananas: 12,
    eggs: one,
});
// I ate number of bananas that ends with 2 and one eggs for dinner
```

`plural` property of translation value used for pluralization. It as an array to keep execution order.
The structure of pluralization entry is a tuple: `[operation, value]`.
Translator supports few operators: `>`,`<`,`=`,`<=`,`>=`, `in []`, `between`, `%`, `...`, and `_` for _default_. Operations can only be done with static numbers provided in `operation`.  
Please note that divisibility operator `%` compares remainder (or modulo) operation result with 0. It is possible to use `%` with specific remainder: `%2=0`.  
Execution order is important because compare operations runs from top to bottom and when criteria is met then translation will use `value` provided for `operation`.

### Plural translations

In case if dynamic parameters have to be translated you can use `$&{$#}` syntax.  
It is possible to modify plural translations a little bit like so: `$&{my-$#-value}`.  
In rare cases you are able to use dynamic replacement `${...}` placeholders as well.

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
        lang: 'en-US',
    }
);
translations.translate('i-ate-apples-for', {
    apples: 1,
    when: 'dinner',
});
// I ate Only One apple for Dinner
translations.translate('i-ate-apples-for', {
    apples: 2,
    when: 'breakfast',
});
// I ate Two apples for Breakfast
translations.translate('i-ate-apples-for', {
    apples: 4,
    when: 'breakfast',
});
// I ate Two apples for Breakfast
translations.translate('i-ate-apples-for', {
    apples: 5,
    when: 'breakfast',
    yay: 'wow',
});
// I ate 5 (WOW!) apples for Breakfast
```

### Cases

_(v0.20.0+)_  
**(experimental)**
Cases are similar to _pluralization_ but bit simpler. At the moment there is only truthy/falsy check.  
Little bit different syntax like translation placeholder, instead of `&` - `!`: `$!{...}`.

```javascript
let translations = new Translations({
    'en-US': {
        somebody_ate_bananas: {
            value: '$&{prefix}$!{prefix}${person} ate bananas',
            cases: {
                prefix: [
                    ['!!', ' '],
                    ['!', ''],
                ],
            },
        },
        sir: 'Sir',
        madam: 'Madam',
    },
});

translations.translate('somebody_ate_bananas', {
    prefix: 'sir',
    person: 'Holmes',
});
// Sir Holmes ate bananas

translations.translate('somebody_ate_bananas', {
    person: 'Holmes',
});
// Holmes ate bananas
```

Use replace pattern `$#` in combination with `$` or `&` for a bit more complex scenarios (like pluralization)

```javascript
let translations = new Translations({
    'en-US': {
        i_have_been_here_count: {
            value: '$!{count} ${days}',
            cases: {
                count: [
                    ['!!', "I've been here ${count}"],
                    ['!', 'I have not been here'],
                ],
            },
            plural: {
                count: [
                    ['=1', 'once'],
                    ['=2', 'twice'],
                    ['in [3,4,5]', 'few times'],
                    ['>10', 'many times'],
                    ['_', '$# times'],
                ],
                days: [
                    ['<2', 'today'],
                    ['<5', 'for last few days'],
                    ['_', 'for long time'],
                ],
            },
        },
    },
});

translations.translate('i_have_been_here_count', {
    count: 0,
    days: 1,
});
// I have not been here today

translations.translate('i_have_been_here_count', {
    count: 2,
    days: 3,
});
// I've been here twice for last few days
```

As you can see this is pretty simple but may bring some value for conditional placeholders. Still figuring value of this out...

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
});
```

### Pipeline

_(v0.20.0+)_  
**(experimental)**
To manage translation flow now there is a **pipeline** functionality that runs **middlewares**.  
Default flow is the same, but now it is possible to add custom **middlewares** to the flow or build custom one from the scratch.
At the moment there is `SimpleDefaultPipeline` which is the old one with _fallback language_ which will be _removed_ in future. And `SimplePipeline` with access to **middlewares** collection.  
In the `Middleware` you have access to execution `Context`. `result` property contains `value` that is going to be finial result of the entire flow. And `params` is the accepted data to be used in the flow. It is intended to be **readonly**.

```javascript
const pipeline = new SimplePipeline();
pipeline.addMiddleware((context) => {
        const { params, result } = context;
        if (result.fallingBack) {
            // do some logic here for NOT translated values
            console.warn(`the value for ${params.key} is not translated`);
            result.value = `!WARNING: ${result.value} [${params.key}]`;
        } else {
            // do some logic here for translated values
            result.value = `${result.value}: YAY!`;
        }
    });
let translations = new Translations(..., pipeline);
```

`addMiddleware` adds middleware to the end of the pipeline queue. `addMiddlewareAt` and `removeMiddlewareAt` adds middleware at the index.
