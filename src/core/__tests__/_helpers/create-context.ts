import { TranslateKeyInstance } from '../../translation-key';
import { Context, Dictionaries, DictionaryEntry, TranslateKey } from '../../types';

export const LANG = 'en';

/**
 * Builds the minimal context a middleware receives from the pipeline: the key wrapped in a
 * `TranslateKeyInstance`, whatever dictionaries the test needs, and an empty result to fill in.
 */
export function createContext(
    key: TranslateKey,
    options: { dictionaries?: Dictionaries; fallback?: DictionaryEntry | string } = {}
): Context {
    return {
        params: {
            lang: LANG,
            dictionaries: options.dictionaries ?? {},
            key: new TranslateKeyInstance(key),
            fallback: options.fallback,
        },
        result: {},
    };
}
