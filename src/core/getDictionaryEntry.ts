import { TranslateKey } from './translationKey';
import { Dictionary, DictionaryEntry } from './types';

export function getDictionaryEntry(
    key: TranslateKey,
    dictionary: Dictionary | undefined,
    fallbackDictionary?: Dictionary | undefined
): string | DictionaryEntry | undefined {
    if (!key) {
        return undefined!;
    }

    if (!dictionary) {
        if (fallbackDictionary) {
            return getDictionaryEntry(key, fallbackDictionary);
        }
        return undefined;
    }

    if (key.asArray.length > 1) {
        var _term = dictionary as any;
        var _key = key.asArray;
        for (var i = 0; i < _key.length; i++) {
            if (_term == null) break;
            _term = _term[_key[i]];
        }
        return _term == undefined ? key.asString : _term;
    }

    var term = dictionary[key.asString];
    if (!term && fallbackDictionary) {
        return getDictionaryEntry(key, fallbackDictionary);
    }
    return term as string | DictionaryEntry | undefined;
}
