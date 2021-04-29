# Simply Translate
Simplest translations for JS. Consider it even more as a mapper of keys to values, this is not AI or something... :)

### Install
```javascript
npm i simply-translate
```
### Import
```javascript
import { Translations } from 'simply-translate';
```
*Typescript* (4.0) supported

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
  "en-US": {
    "hello_world":"Hello World",
    "goodbye_world":{
      "value":"Goodbye World",
      "description":"When you want to say goodbye tho the world"
    },
  },
};
```
### Translate
by calling `translate` function
```javascript
// create translations with dictionary:
const translations = new Translations({...}, {cacheDynamic: true});
const translated = translations.translate('en-US', 'hello_world');
```
To use dynamic data that can be passed to as parameters for translation add `{...}` with property name of the passed data.
```javascript
const dics = {
  "en-US": {
    "hello_user":"Hello {name}!",
  },
};
const translations = new Translations(dics);
translations.translate('en-US', 'hello_user', {user:'Oleg'});
// Hello Oleg!
```
### Fallback value
can be passed to `translate` function to be shown instead of absent translation.
```javascript
const dics = {
  "en-US": {
    "hello_world":"Hello World",
  },
};
const translations = new Translations(dics);
translations.translate('en-US', 'hello_{user}', {user:'Oleg'}, 'Hello');
// Hello Oleg!
```
To add clarity you can use `{...}` in keys.
And it will be useful in no translation value and fallback provided, so key the will be used for the value with result `hello_Oleg`
```javascript
const dics = {
  "en-US": {
    "hello_{user}":"Hello {name}!",
  },
};
const translations = new Translations(dics);
translations.translate('en-US', 'hello_{user}', {user:'Oleg'});
// Hello Oleg!
```
It is possible to use fallback values for dynamic parameters _(v0.0.4+)_:
```javascript
const dics = {
  "en-US": {
    "hello_{user}":"Hello {name?User}!",
  },
};
const translations = new Translations(dics);

translations.translate('en-US', 'hello_{user}', {user:undefined});
// Hello User!
translations.translate('en-US', 'hello_{user}', {user:undefined}, 'hello_{user?Friend}');
// Hello Friend!
```
### Pluralization
As this is Simple translation lib, so it works with pluralization in the simple way as well.
```javascript
let translations = new Translations(
{
 'en-US': {
   'i-ate-{eggs}-{bananas}-dinner': {
     value: "I ate {bananas} and {eggs} for dinner",
     plural: {
       bananas: [
         ["<= 0", "no bananas"],
         ["= 1", "one banana"],
         ["in [3,4]", "few bananas"],
         ["> 10", "too many bananas"],
         [">= 5", "many bananas"]
       ],
       eggs: [
         ["= 0", "zero eggs"],
         ["= 1", "one egg"],
         ["between 2 and 4", "some eggs"],
         ["_", "{$} eggs"],
       ],
     },
     description: "translations",
   },
 }
});
translations.translate('en-US', 'i-ate-{eggs}-{bananas}-dinner', { bananas: 0, eggs: 1 });
// I ate no bananas and one egg for dinner
translations.translate('en-US', 'i-ate-{eggs}-{bananas}-dinner', { bananas: 3, eggs: 2 });
// I ate few bananas and 2 eggs for dinner
translations.translate('en-US', 'i-ate-{eggs}-{bananas}-dinner', { bananas: 1, eggs: 1 });
// I ate one banana and one egg for dinner
translations.translate('en-US', 'i-ate-{eggs}-{bananas}-dinner', { bananas: 11, eggs: 0 });
// I ate too many bananas and zero eggs for dinner
translations.translate('en-US', 'i-ate-{eggs}-{bananas}-dinner', { bananas: 6, eggs: 3 });
// I ate many bananas and some eggs for dinner
```
Pluralization are added to `plural` property of translation value as an array to keep execution order.
The structure of pluralization entry is a tuple: `[operation, value]`.
Translator supports few operators: `>`,`<`,`=`,`<=`,`>=`, `in []`, `between` _(v0.0.4+)_, and `_` for _default_. Operations can only be done with static numbers provided in `operation`;
Execution order is important because compare operations run from top to bottom and as soon criteria is met translation will use a `value` provided for `operation`.

### Inner translations
_(v0.0.4+)_ In case if dynamic parameters have to be translated you can use `$T` prefix before placeholder in translation.
```javascript
let translations = new Translations(
  {
    "en-US": {
      "i-ate-{apples}-{when}": {
        value: "I ate {apples} for $T{when}",
        plural: {
          apples: [
            ["= 1", "$T{$} apple"],
            ["in [2,3]", "$T{$} apples"],
            ["_", "$T{$} apple(s)"],
          ],
        },
      },
      "dinner": "Dinner",
      "breakfast": "Breakfast",
      "1":"One",
      "2":"Two",
      "3":"Three",
    },
  }
);
translations.translate("en-US", "i-ate-{apples}-{when}", { apples: 1, when: "dinner" });
// I ate One apple for Dinner
translations.translate("en-US", "i-ate-{apples}-{when}", { apples: 2, when: "breakfast" });
// I ate Two apples for Breakfast
translations.translate("en-US", "i-ate-{apples}-{when}", { apples: 4, when: "breakfast" });
// I ate 4 apple(s) for Breakfast
```

### Cache
As dictionaries are plan JS objects, getting values by a key is not a big deal for engine, but when yiu use *dynamic values* translator needs to parse string and fill it with data, etc. To increase performance you might want to store dynamically translated values in some cache.
To do so just pass the option to `Translations` constructor like so: `new Translations({...}, {cacheDynamic: true});`. 
Translator will keep translation with unique identifier made from the dynamic value so if you have way to dynamic application, consider this tradeoff.

