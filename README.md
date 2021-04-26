# Simply Translate
Simplest translations for JS. Consider it even more as a mapper of keys to values, this is not AI or something... :)

### Install
```javascript
npm i simply-translate;
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
      "description":"When you want to say goodbye to the world"
    },
  },
};
```
###Translate
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
const translated = translations.translate('en-US', 'hello_user', {user:'Oleg'});
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
const translated = translations.translate('en-US', 'hello_{user}', {user:'Oleg'}, 'Hello);
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
const translated = translations.translate('en-US', 'hello_{user}', {user:'Oleg'});
// Hello Oleg!
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
         ["= 0", "no bananas"],
         ["= 1", "one banana"],
         ["in [3,4]", "{$} bananas"],
         ["> 10", "too many bananas"],
         ["> 5", "many bananas"],
         ["_", "{$} bananas"],
       ],
       eggs: [
         ["= 0", "zero eggs"],
         ["= 1", "one egg"],
         ["_", "{$} eggs"],
       ],
     },
     description: "translations",
   },
 }
});
translations.translate('en-US', 'i-ate-{eggs}-{bananas}-dinner', { bananas: 0, eggs: 3 });
// I ate no bananas and 3 eggs for dinner
translations.translate('en-US', 'i-ate-{eggs}-{bananas}-dinner', { bananas: 3, eggs: 4 });
// I ate 3 bananas and 4 eggs for dinner
translations.translate('en-US', 'i-ate-{eggs}-{bananas}-dinner', { bananas: 1, eggs: 2 });
// I ate one banana and 2 eggs for dinner
translations.translate('en-US', 'i-ate-{eggs}-{bananas}-dinner', { bananas: 11, eggs: 0 });
// I ate too many bananas and zero eggs for dinner
translations.translate('en-US', 'i-ate-{eggs}-{bananas}-dinner', { bananas: 6, eggs: 1 });
// I ate many bananas and one egg for dinner
```
Pluralizations are added to `plural` property of translation value as an array to keep executio order.
The structure of pluralization entry is a tupple: `[operation, value]`.
Translator supports few operators: `>`,`<`,`=`,`<=`,`>=`, `in []`, and `_` for *default*. Operations can only be done with static numbers provided in `operation`;
Execution order is important because compare operations run from top to bottom and as soon criteria is met translation will use a `value` provided for `operation`.

### Cache
As dictionalrues are plan JS objects reaching out to values by a key is not a big deal for engine, but when yiu use *dynamic values* translator needs to parse string fill it with data, etc. Do to encrease performace you might want to store dynamically translated values in some cache.
To do so just pass the option to `Translations` constructor like so: `new Translations({...}, {cacheDynamic: true});`. 
Translator will keep translation with unique identifier made from the dynamic value so if you have way to dynamic application, consider this tradeoff.

