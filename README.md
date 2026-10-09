# Simply Translate

Simple, dependency-free translations for JavaScript and TypeScript. Think of it as a dictionary lookup with placeholders, pluralization and fallbacks, not machine translation.

-   Nested dictionaries with namespaces
-   Placeholders for dynamic values, with defaults
-   Pluralization with custom rules or [CLDR](https://cldr.unicode.org/index/cldr-spec/plural-rules) categories (`one`, `few`, `many`, …)
-   Fallback language and fallback values
-   Extensible translation pipeline (middleware)
-   TypeScript types included; ES module and CommonJS builds

## Contents

-   [Install](#install)
-   [Quick start](#quick-start)
-   [Dictionaries](#dictionaries)
-   [Translating](#translating)
-   [Placeholders](#placeholders)
-   [Missing translations](#missing-translations)
-   [Pluralization](#pluralization)
-   [Cases](#cases)
-   [Operators](#operators)
-   [Extending dictionaries](#extending-dictionaries)
-   [Pipeline and middleware](#pipeline-and-middleware)
-   [Changelog](#changelog)

## Install

```bash
npm i simply-translate
```

```javascript
// ES modules
import { Translations } from 'simply-translate';

// CommonJS
const { Translations } = require('simply-translate');
```

Bundlers get the ES module build and Node gets the CommonJS build automatically. `simply-translate/commonjs` still works for existing code.

## Quick start

```javascript
import { Translations } from 'simply-translate';

const translations = new Translations(
    {
        'en-US': { hello_user: 'Hello ${user}!' },
        'ru-RU': { hello_user: 'Привет, ${user}!' },
    },
    { lang: 'en-US' }
);

translations.translate('hello_user', { user: 'Oleg' });
// Hello Oleg!
translations.translateTo('ru-RU', 'hello_user', { user: 'Oleg' });
// Привет, Oleg!
```

## Dictionaries

Dictionaries are plain objects keyed by language. Each entry is either a string or an object with a required `value` and optional `description`, `plural` and `cases`.

```javascript
const dictionaries = {
    'en-US': {
        hello_world: 'Hello World',
        goodbye_world: {
            value: 'Goodbye World',
            description: 'When you want to say goodbye to the world',
        },
    },
    'ru-RU': {
        hello_world: 'Привет, мир',
    },
};
```

Use real locale tags such as `en-US` or `ru` as language keys if you use [CLDR plural categories](#cldr-plural-categories).

### Namespaces

Nest objects to group entries, then address them with a dot-separated key or an array of key parts. Don't use `.` inside your own keys.

```javascript
const translations = new Translations(
    {
        'en-US': {
            user: {
                hello_user: 'Hello ${user}!',
                goodbye_user: { value: 'Goodbye ${user}!' },
            },
        },
    },
    { lang: 'en-US' }
);

translations.translate('user.hello_user', { user: 'Oleg' });
// Hello Oleg!
translations.translate(['user', 'goodbye_user'], { user: 'Oleg' });
// Goodbye Oleg!
```

## Translating

```javascript
const translations = new Translations(dictionaries, {
    lang: 'en-US', // language used by translate()
    fallbackLang: 'en-US', // optional, see Missing translations
    placeholder: 'default', // optional, see Single and double braces
});

translations.translate('hello_world'); // uses translations.lang
translations.translateTo('ru-RU', 'hello_world'); // explicit language

translations.lang = 'ru-RU'; // switch the current language

translations.hasTranslation('hello_world'); // true
translations.hasTranslationTo('en-US', 'missing_key'); // false
```

Both `translate` and `translateTo` accept optional dynamic values and a fallback:

```javascript
translations.translate(key);
translations.translate(key, fallback);
translations.translate(key, dynamicProps, fallback);
translations.translateTo(lang, key, dynamicProps, fallback);
```

## Placeholders

| Syntax      | Inserts                                                         |
| ----------- | --------------------------------------------------------------- |
| `${name}`   | the value of `name`                                             |
| `$&{name}`  | the translation of the value of `name` (used as a key)          |
| `&{text}`   | the translation of the literal key `text`                       |
| `$!{name}`  | the matching [case](#cases) for `name`                          |
| `$#`        | the number, inside [plural](#pluralization) and case options    |

```javascript
const translations = new Translations(
    {
        'en-US': {
            hello_user: 'Hello ${user}!',
            hello_user_translated: 'Hello $&{user}!',
            hello_guest: 'Hello &{guest}!',
            guest: 'Guest',
            oleg: 'Олег',
        },
    },
    { lang: 'en-US' }
);

translations.translate('hello_user', { user: 'oleg' });
// Hello oleg!
translations.translate('hello_user_translated', { user: 'oleg' });
// Hello Олег!
translations.translate('hello_guest');
// Hello Guest!
```

### Default values

Add `?default` to use a default when the value is `null` or `undefined`. Without a default, the placeholder becomes an empty string.

```javascript
const translations = new Translations(
    {
        'en-US': {
            hello_user: 'Hello ${user?Friend}!',
            hi_user: 'Hi ${user}!',
        },
    },
    { lang: 'en-US' }
);

translations.translate('hello_user', { user: 'Oleg' });
// Hello Oleg!
translations.translate('hello_user', {});
// Hello Friend!
translations.translate('hi_user', {});
// Hi !
```

Defaults may contain only Latin letters, digits, spaces and `_`. For other languages, translate the default instead: `$&{user?User}` looks up the key `User`.

```javascript
const translations = new Translations(
    {
        'ru-RU': {
            hello_user: 'Привет, $&{user?User}!',
            User: 'Пользователь',
        },
    },
    { lang: 'ru-RU' }
);

translations.translate('hello_user', {});
// Привет, Пользователь!
```

### Single and double braces

If your strings already use `{name}` or `{{name}}`, set `placeholder` to `'single'` or `'double'`. The `$` prefix is then implied: `{name}` works like `${name}` and `&{name}` like `$&{name}`, so there is no way to translate literal text. Prefer the default `$` syntax where you can.

```javascript
const translations = new Translations(
    { 'en-US': { hello_user: 'Hello {user}!' } },
    { lang: 'en-US', placeholder: 'single' }
);

translations.translate('hello_user', { user: 'Oleg' });
// Hello Oleg!
```

## Missing translations

When a key isn't found, the library tries, in order:

1. the dictionary for the current language,
2. the dictionary for `fallbackLang`,
3. the `fallback` argument,
4. the key itself.

Placeholders are filled at every step.

```javascript
const translations = new Translations(
    {
        'en-US': { goodbye_user: 'Goodbye ${user}!' },
        'ru-RU': { hello_user: 'Привет, ${user}!' },
    },
    { lang: 'ru-RU', fallbackLang: 'en-US' }
);

translations.translate('hello_user', { user: 'Oleg' });
// Привет, Oleg!            (ru-RU)
translations.translate('goodbye_user', { user: 'Oleg' }, 'Bye ${user}!');
// Goodbye Oleg!            (en-US wins over the fallback argument)
translations.translate('nice_day', { user: 'Oleg' }, 'Have a nice day, ${user}!');
// Have a nice day, Oleg!   (fallback argument)
translations.translate('nice_day_${user}', { user: 'Oleg' });
// nice_day_Oleg            (the key)
```

## Pluralization

Add a `plural` object to an entry. Each placeholder gets a list of `[operation, text]` rules. Rules are checked top to bottom and the first match wins, so put the catch-all `_` (or `other`) last. Use `$#` to insert the number. If no rule matches, the raw value is inserted.

```javascript
const translations = new Translations(
    {
        'en-US': {
            ate_bananas: {
                value: 'I ate ${bananas}',
                plural: {
                    bananas: [
                        ['= 0', 'no bananas'],
                        ['= 1', 'one banana'],
                        ['in [2,3]', 'a couple of bananas'],
                        ['% 11', '$# bananas, divisible by eleven'],
                        ['_', '$# bananas'],
                    ],
                },
            },
        },
    },
    { lang: 'en-US' }
);

translations.translate('ate_bananas', { bananas: 0 });
// I ate no bananas
translations.translate('ate_bananas', { bananas: 3 });
// I ate a couple of bananas
translations.translate('ate_bananas', { bananas: 22 });
// I ate 22 bananas, divisible by eleven
translations.translate('ate_bananas', { bananas: 7 });
// I ate 7 bananas
```

See [Operators](#operators) for every supported operation.

### CLDR plural categories

_(v1.0.0+)_ Languages split numbers into plural forms differently. Rules named after [CLDR categories](https://cldr.unicode.org/index/cldr-spec/plural-rules) (`zero`, `one`, `two`, `few`, `many`, `other`) use the built-in `Intl.PluralRules` for the dictionary's language, so you don't have to work the rules out yourself.

```javascript
const translations = new Translations(
    {
        'en-US': {
            apples: {
                value: '${count}',
                plural: { count: [['one', '$# apple'], ['other', '$# apples']] },
            },
        },
        'ru-RU': {
            apples: {
                value: '${count}',
                plural: {
                    count: [
                        ['one', '$# яблоко'],
                        ['few', '$# яблока'],
                        ['many', '$# яблок'],
                        ['other', '$# яблока'],
                    ],
                },
            },
        },
    },
    { lang: 'ru-RU' }
);

translations.translate('apples', { count: 1 }); // 1 яблоко
translations.translate('apples', { count: 2 }); // 2 яблока
translations.translate('apples', { count: 5 }); // 5 яблок
translations.translate('apples', { count: 21 }); // 21 яблоко
translations.translateTo('en-US', 'apples', { count: 5 }); // 5 apples
```

-   The language key is passed to `Intl.PluralRules` as the locale, so it must be a valid locale tag. An invalid one, such as `english`, throws when the rule runs.
-   Categories a language doesn't use never match. English, for example, only has `one` and `other`.
-   CLDR rules can be mixed with other operators, for example `['= 0', 'no apples']` before `['one', …]`.

### Translating inside plural rules

Plural texts support the same placeholders as values. `&{$#}` translates the number itself, and you can build keys around it, such as `&{$#-only}`.

```javascript
const translations = new Translations(
    {
        'en-US': {
            ate_apples_for: {
                value: 'I ate ${apples} for $&{meal}',
                plural: {
                    apples: [
                        ['= 1', '&{$#-only} apple'],
                        ['in [2,3]', '&{$#} apples'],
                        ['= 5', '$# ($&{reaction}) apples'],
                        ['_', '$# apple(s)'],
                    ],
                },
            },
            dinner: 'Dinner',
            breakfast: 'Breakfast',
            '1-only': 'Only One',
            2: 'Two',
            3: 'Three',
            wow: 'WOW!',
        },
    },
    { lang: 'en-US' }
);

translations.translate('ate_apples_for', { apples: 1, meal: 'dinner' });
// I ate Only One apple for Dinner
translations.translate('ate_apples_for', { apples: 2, meal: 'breakfast' });
// I ate Two apples for Breakfast
translations.translate('ate_apples_for', { apples: 5, meal: 'breakfast', reaction: 'wow' });
// I ate 5 (WOW!) apples for Breakfast
translations.translate('ate_apples_for', { apples: 7, meal: 'breakfast' });
// I ate 7 apple(s) for Breakfast
```

## Cases

_(v0.20.0+, experimental)_ Cases pick a text based on a value, like pluralization, but for any condition. Reference them with `$!{name}` and define rules under `cases`. Cases run **before** pluralization, so the text a case produces can contain plural placeholders. Cases support fewer [operators](#operators) than plurals.

```javascript
const translations = new Translations(
    {
        'en-US': {
            somebody_ate_bananas: {
                value: '$!{title}${person} ate bananas',
                cases: {
                    title: [
                        ['!!', '&{$#} '],
                        ['!', ''],
                    ],
                },
            },
            sir: 'Sir',
            madam: 'Madam',
        },
    },
    { lang: 'en-US' }
);

translations.translate('somebody_ate_bananas', { title: 'sir', person: 'Holmes' });
// Sir Holmes ate bananas
translations.translate('somebody_ate_bananas', { person: 'Holmes' });
// Holmes ate bananas
```

Combined with pluralization:

```javascript
const translations = new Translations(
    {
        'en-US': {
            visits: {
                value: '$!{count} ${days}',
                cases: {
                    count: [
                        ['= 0', 'I have not been here'],
                        ['_', "I've been here ${count}"],
                    ],
                },
                plural: {
                    count: [
                        ['= 1', 'once'],
                        ['= 2', 'twice'],
                        ['_', '$# times'],
                    ],
                    days: [
                        ['< 2', 'today'],
                        ['< 5', 'in the last few days'],
                        ['_', 'in a long time'],
                    ],
                },
            },
        },
    },
    { lang: 'en-US' }
);

translations.translate('visits', { count: 0, days: 1 });
// I have not been here today
translations.translate('visits', { count: 2, days: 3 });
// I've been here twice in the last few days
```

## Operators

Operations compare against the static values written in the rule.

| Operator                | Example                      | Matches when the value…                | `plural` | `cases` |
| ----------------------- | ---------------------------- | -------------------------------------- | :------: | :-----: |
| Truthy / falsy          | `!!` / `!`                   | is truthy / falsy                      |    ✓     |    ✓    |
| Compare                 | `= 1`, `!= 1`, `< 2`, `>= 5` | compares as written (`==` also works)  |    ✓     |    ✓    |
| Ends with / starts with | `...2` / `2...`              | ends / starts with `2`                 |    ✓     |    ✓    |
| In                      | `in [2,4,8]`                 | is one of the listed numbers           |    ✓     |         |
| Between                 | `between 2 and 5`            | is from 2 to 5, inclusive              |    ✓     |         |
| Remainder               | `% 3`, `% 3 = 2`             | divided by 3 leaves 0 / leaves 2       |    ✓     |         |
| CLDR category           | `zero` `one` `two` `few` `many` | is in that category for the language |    ✓     |         |
| Default                 | `_` or `other`               | always                                 |    ✓     |    ✓    |

Using an operator that a section doesn't support throws an error.

## Extending dictionaries

`extendDictionary` deep-merges new entries into a language. Without a language argument it extends the current `lang`.

```javascript
translations.extendDictionary('en-US', {
    fruits: {
        ate_mangos: {
            value: 'I ate ${mangos}',
            plural: {
                mangos: [
                    ['< 1', 'no mangos'],
                    ['= 1', 'one mango'],
                    ['_', '$# mangos'],
                ],
            },
        },
    },
    tools: {
        fork: 'fork',
    },
});

translations.translate('fruits.ate_mangos', { mangos: 2 });
// I ate 2 mangos

translations.extendDictionary({ spoon: 'spoon' }); // current language
```

## Pipeline and middleware

_(v0.20.0+, experimental)_ Each translation runs through a pipeline of middleware. You can add your own steps, for example to log missing translations, or build a pipeline from scratch.

-   `SimpleDefaultPipeline` is used by default and includes the fallback-language step.
-   `SimplePipeline` is the same without the fallback-language step, so `fallbackLang` has no effect with it.

A middleware receives the execution context. `context.params` holds the input (`key`, `lang`, `dynamicProps`, `fallback`, …) and should be treated as read-only. `context.result.value` is the final text. `context.result.fallingBack` is `true` when the current language has no entry for the key, and `context.result.fallingBackLang` names the fallback language if it supplied the text.

```javascript
import { Translations, SimpleDefaultPipeline } from 'simply-translate';

const pipeline = new SimpleDefaultPipeline();
pipeline.addMiddleware((context) => {
    const { params, result } = context;
    if (result.fallingBack) {
        console.warn(`missing ${params.lang} translation: ${params.key}`);
        result.value = `!${result.value}`;
    }
});

const translations = new Translations(dictionaries, { lang: 'en-US' }, pipeline);
```

-   `addMiddleware(middleware)` appends to the end of the pipeline.
-   `addMiddlewareAt(index, middleware)` inserts at a position.
-   `removeMiddlewareAt(index)` removes the middleware at a position.
-   `middlewares` lists the current steps.

## Changelog

See [CHANGELOG.md](https://github.com/oleg-wx/translate/blob/master/CHANGELOG.md) for release notes and steps for upgrading from 0.x.
