# Simply Translate

Simplest translations for JS. Even consider it more as an object mapper, a Dictionary, but not translation AI or Bot or something... :)  
_[Typescript support]_

### **Breaking changes**

#### (v0.20.0)

-   added **middleware pipeline** _(see [Pipeline](#Pipeline))_.
-   added **remainder** (modulo) operator `%`.
-   added **ends-with** and **starts-with** operators `...`.
-   added **truthy/falsy** operators `!`/`!!`.
-   added **cases** functionality _(see [Cases](#Cases))_.
-   added double curly brackets `{{...}}` support for placeholder.
-   deprecated `defaultLang` property over `lang` name.
-   deprecated `$less` property. Instead of `$less` use `placeholder = 'single'`.
-   not falling back to placeholder property name.
-   removed **dynamic cache**.
-   ~~deprecated `fallbackLang` property~~ `fallbackLang` remains.
-   added _commonjs_ version (`simply-translate/commonjs`)

#### (v0.10.0)

-   `$T{...}` replaced with `$&{...}`.
-   `{$}` and `$T{$}` removed from **pluralization**, use `$#` instead _(see [Plural translations](#Plural-translations))_.

---

### Install

```javascript
npm i simply-translate
```

### Import

#### ES6 modules

```javascript
import { Translations } from 'simply-translate';
```

#### CommonJS modules

```javascript
import { Translations } from 'simply-translate/commonjs';
```

### Initialize

```javascript
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

is a set of values with a unique string as a key and a string or object with _value_ (which is required), _description_, and (optionally) _plural_ and _cases_ data.

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

`translate` or `translateTo` methods.  
`translate` method uses `lang` property of `Translations`, `translateTo` requires language parameter.

```javascript
// create translations with dictionary:
const translations = new Translations({...}, {lang:'en-US'});
const translated = translations.translate('hello_world');
const translated = translations.translateTo('en-US', 'hello_world');
```

For Dynamic data use `${...}` with field name of the data object.

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

_v0.0.20_ `$less` is deprecated. Instead of `$less` use `placeholder = 'single'`.  
It is required to add \$ before placeholders. However it is possible to use _$-less_ placeholders by setting `placeholder` property of `Translations` to _single_ (`{...}`) or _double_ (`{{...}}`) curly-braces, however it is _not recommended_.

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

Please **note** `$` prefix will replace placeholder with property value from the data object, `$&` translate value from data object, and `&` will just translate the placeholder text.  
And **note**: _single_ or _double_ placeholder ignores `$` as if it is there so using _just translate_ `&` function is _not available_.

```javascript
const dics = {
    'en-US': {
        hello_user: 'Hello ${user}!',
        hello_user_r: 'Hello $&{usr}!',
        hello_user_t: 'Hello &{usr}!',
        usr: 'User',
        oleg: 'Олег',
    },
};
const translations = new Translations(dics, { lang: 'en-US' });
translations.translate('hello_user', { user: 'oleg' });
// Hello oleg!
translations.translate('hello_user_t', { user: 'oleg' });
// Hello User!
translations.translate('hello_user_r', { user: 'oleg' });
// Hello Олег!
```

### Namespaces

Group items in dictionary.

```javascript
const dics = {
    'en-US': {
        user: {
            hello_user: 'Hello ${user}!',
            goodbye_user: { value: 'Goodbye ${user}!' },
        },
    },
};
const translations = new Translations(dics, { lang: 'en-US' });
translations.translate('user.hello_user', { user: 'Oleg' });
// Hello Oleg!
translations.translate(['user', 'goodbye_user'], { user: 'Oleg' });
// Goodbye Oleg!
```

You don't need to directly point to `value`, it is done by default.

Do **not use** namespaces separator (`.`) for dictionary **keys**.

### Fallback value

If value is not found and `fallback` is not provided, _key_ will be used as _value_.

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

You may use `${...}` in keys, **however** it is **not** required, but might be useful.

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

It is possible to use fallback values for dynamic fields. **Note**: Due to implementation limitations (and keep library clean of dependencies) **only Latin** characters supported for placeholders and fallback.  
Since _ver.0.20.0_ if property is null or undefined placeholder will be empty _(not property name as it was)_.

```javascript
const dics = {
    'en-US': {
        'hello_${user}': 'Hello ${user?User}!',
    },
};
const translations = new Translations(dics, { lang: 'en-US' });

translations.translate('hello_user', { user: undefined });
// Hello User!
translations.translate('hi_user', { user: undefined }, 'Hi ${user?Friend}');
// Hi Friend!
translations.translate('hi_user', { user: undefined }, 'Hi ${user}');
// Hi !
```

Next will fail to replace placeholder:

```javascript
translations.translateTo('ru-RU', 'hi_${user}', { user: 'Олег' }, 'Привет ${user?Пользователь}');
// Привет ${user?Пользователь}
```

To solve this add translation term:

```javascript
translations.extendDictionary('ru-RU', {
    User: 'Пользователь',
});
translations.translateTo('ru-RU', 'hi_${user}', { user: undefined }, 'Привет $&{user?User}');
// Привет Пользователь
```

### Fallback language

Fallback language will use dictionary if selected language does not contain translation. Fallback dictionary will be used before fallback value.

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
`plural` property of translation value used for pluralization. Execution order is sequential.  
The structure of pluralization entry is a tuple: `[operation, value]`.  
Supported [operators](#Operators): _truthy/falsy_ `!!`/`!`, _compare_: `>`,`<`,`=`,`<=`,`>=`; and _few more_: `in []` `between`, `%`, `...`, and `_` for _default_. Operations can only be done with static numbers provided in `operation`.  
Please **note**: remainder operator `%` compares remainder (or modulo) operation result with 0. It is possible to use `%` with specific remainder: `%2=0`.

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
Similar to _pluralization_ and executes **before pluralization**. Supports a bit less [operators](#Operators): _truthy/falsy_, _compare_ and _end/startsWith_ `...` operators.  
Little bit different syntax placeholder, similar to translations but instead of `&` use `!`: `$!{...}`.  
Use replace pattern `$#` in combination with `$` or `&` and pluralization.

```javascript
let translations = new Translations({
    'en-US': {
        somebody_ate_bananas: {
            value: '$!{prefix}${person} ate bananas',
            cases: {
                prefix: [
                    ['!!', '&{$#} '],
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

```javascript
let translations = new Translations({
    'en-US': {
        i_have_been_here_count: {
            value: '$!{count} ${days}',
            cases: {
                count: [
                    ['== 0', 'I have not been here'],
                    ['_', "I've been here ${count}"],
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

### Operators

-   Truthy/Falsy `!!`/`!`: `['!!','appear if value is truthy']` / `['!','appear if value is falsy']`
-   Compare `>`,`<`,`=`,`<=`,`>=`. Just regular compare operators: `['<2','appear if value is less then 2']`
-   In `in []`: `['in [2,4,8]', 'only for 2, 4, and 8']`. Works only for pluralization and with digits.
-   Between `between`: `['between 2 and 5', 'for 2, 3, 4, and 8']`. Works only for pluralization and with digits.
-   Remainder `%`: `['%2', 'remainder that equals to 0 left over when divided by 2']`, `['%3=5', 'remainder that equals to 5 when divided by 3']`
-   Ends/Starts with `...` operators: `['...2', 'ends with 2']`, `['2...', 'starts with 2']`
-   and `_` for _default_.
    Operators uses static values provided in `operation`.  
    Operators in `plural` or `cases` executes in the order in which it is listed, so it is important to next rule is not prevented by current, especially default `_`.

### Add terms to dictionary

To **extend** dictionary with new values use `extendDictionary` method.

```javascript
translations.extendDictionary('en-US', {
    fruits: {
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
        mango: 'mango',
    },
    tools: {
        fork: 'fork',
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
