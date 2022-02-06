import { TranslateKeyInstance } from './translationKey';
import { Dictionary, DictionaryEntry } from './types';

export function getDictionaryEntry(
    dictionaries: { [lang: string]: Dictionary },
    lang: string,
    key: TranslateKeyInstance
): string | DictionaryEntry | undefined {
    let dictionary = dictionaries[lang];
    if (!key) {
        return undefined!;
    }

    if (!dictionary) {
        return undefined;
    }

    let result: string | DictionaryEntry | undefined;

    if (key.asArray.length > 1) {
        var _term = dictionary as any;
        var _key = key.asArray;
        for (var i = 0; i < _key.length; i++) {
            if (_term == null) break;
            _term = _term[_key[i]];
        }
        result = _term;
    } else {
        result = dictionary[key.asString] as any;
    }

    if (
        typeof result === 'string' ||
        typeof (result as any)?.value === 'string'
    ) {
        return result as string | DictionaryEntry;
    }
    return undefined;
}
