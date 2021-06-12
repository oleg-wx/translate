import { Dictionary, DictionaryEntry, TranslateKey } from "./types";

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
    if (Array.isArray(key)) {
        var _term = dictionary as any;
        for (var i = 0; i < key.length; i++) {
            _term = _term[key[i]];
        }
        return _term;
    }
    var term = dictionary[key];
    if (!term && fallbackDictionary) {
        return getDictionaryEntry(key, fallbackDictionary);
    }
    return term as string | DictionaryEntry | undefined;
}
