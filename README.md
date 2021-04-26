# translate
Simplest translations for JS

Initialize translations with dictionaries:
```javascript
import { Translations } from 'simply-translate/';
// create translations with dictionary and storing dynamically translated values:
const dics = {...};
const translations = new Translations(dics, {cacheDynamic: true});
```

Dictionaries - JSON with languge identifier in the root
```javascript
const dics = {
  "en-US": ...,
  "ru-RU": ...
};
```

Dictionary entry is a set of values with a unique string as a key and a string or object with value (which is requierd) and description
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
Translate by calling `translate` function
```javascript
// create translations with dictionary:
const translations = new Translations({...}, {cacheDynamic: true});
const translated = translations.translate('en-US', 'hello_world');
```
