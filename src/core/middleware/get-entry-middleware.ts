import { DictionaryEntry, DictionaryValue } from '../types';
import { MiddlewareFunc } from '../types';

export const GetEntryMiddleware: MiddlewareFunc = ({ params, result }) => {
    const dictionary =
        params.lang && params.dictionaries
            ? params.dictionaries[params.lang]
            : undefined;
    const key = params.key;

    if (!key || !dictionary) {
        return;
    }

    let value: string | DictionaryEntry | undefined;

    if (key.asArray.length > 1) {
        let _term: DictionaryValue | undefined = dictionary;
        var _key = key.asArray;
        for (var i = 0; i < _key.length; i++) {
            if (_term == null) break;
            _term = (_term as any)[_key[i]];
        }
        value = _term as any;
    } else {
        value = dictionary[key.asString] as any;
    }

    if (typeof value === 'string') {
        result.value = value;
        result.entry = value;
    } else if (typeof (value as any)?.value === 'string') {
        result.value = value?.value;
        result.plurals = value?.plural;
        result.cases = value?.cases;
        result.entry = value;
    }
};
