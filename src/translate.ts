import { compileFunction } from './compileFunction';
import { replacePlaceholdersRegex_$less, replacePlaceholdersRegex } from './core/global';
import { Dictionary, TranslateDynamicProps, TranslateKey } from "./core/types";
import { getDictionaryEntry } from './core/getDictionaryEntry';
import { translate as translate_ } from './core/translate';

export interface TranslateOptions {
    fallbackDictionary?: Dictionary;
    fallback?: string | undefined;
    dynamicCache?: { [key: string]: string } | undefined;
    absentCache?: string[];
    $less?: boolean;
}

/**
 *
 * @param dictionary - Dictionary to use to translate
 * @param key - translation key
 * @param dynamicProps - object to use for placeholders
 * @param options - options
 * @returns
 */
export function translate(
    dictionary: Dictionary | undefined,
    key: TranslateKey,
    dynamicProps?: TranslateDynamicProps,
    options?: TranslateOptions
): string {
    if (key == null || key == '') {
        return '';
    }
    let getEntry = (key: TranslateKey) =>
        getDictionaryEntry(key, dictionary, options?.fallbackDictionary);
    return translate_(
        key,
        getEntry,
        dynamicProps,
        options?.fallback,
        options?.$less ? replacePlaceholdersRegex_$less : replacePlaceholdersRegex,
        options?.dynamicCache,
        options?.absentCache
    );
}





