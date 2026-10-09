import { Dictionary, DictionaryEntry, DictionaryValue } from '../types';
import { MiddlewareFunc } from '../types';

/**
 * Reads one namespace segment. Only a plain object's *own* keys are followed, because a
 * dictionary is a caller-owned object literal: without this, `constructor.name` resolves
 * against `Object.prototype` and "translates" to "Object", and `my-key.0` picks a single
 * character out of an already resolved entry.
 */
function getOwnValue(term: DictionaryValue | undefined, key: string): DictionaryValue | undefined {
    if (typeof term !== 'object' || term === null) {
        return undefined;
    }

    return Object.prototype.hasOwnProperty.call(term, key) ? (term as Dictionary)[key] : undefined;
}

export const GetEntryMiddleware: MiddlewareFunc = ({ params, result }) => {
    const dictionary =
        params.lang && params.dictionaries ? params.dictionaries[params.lang] : undefined;
    const key = params.key;

    if (!key || !dictionary) {
        return;
    }

    let value: DictionaryValue | undefined;

    if (key.asArray.length > 1) {
        const segments = key.asArray;
        let term: DictionaryValue | undefined = dictionary;
        for (let i = 0; i < segments.length; i++) {
            term = getOwnValue(term, segments[i]);
            if (term == null) {
                break;
            }
        }
        value = term;
    } else {
        value = getOwnValue(dictionary, key.asString);
    }

    if (typeof value === 'string') {
        result.value = value;
        result.entry = value;
    } else if (typeof (value as DictionaryEntry)?.value === 'string') {
        result.value = (value as DictionaryEntry).value;
        result.plurals = (value as DictionaryEntry).plural;
        result.cases = (value as DictionaryEntry).cases;
        result.entry = value;
    }
};
