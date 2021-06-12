import {
    Dictionary,
    TranslateDynamicProps,
    TranslateInternalSettings,
} from './core/types';
import { getDictionaryEntry } from './core/getDictionaryEntry';
import { translate as translate_ } from './core/translate';
import globalSettings from './core/globalSettings';
import { TranslateKey } from './core/translationKey';

export interface TranslateSettings extends Partial<TranslateInternalSettings> {
    fallbackDictionary?: Dictionary;
    fallback?: string | undefined;
    dynamicCache?: { [key: string]: string } | undefined;
    absentCache?: string[];
}

/**
 *
 * @param dictionary - Dictionary to use to translate
 * @param key - translation key
 * @param dynamicProps - object to use for placeholders
 * @param settings - options
 * @returns
 */
export function translate(
    dictionary: Dictionary | undefined,
    key: string | string[],
    dynamicProps?: TranslateDynamicProps,
    settings?: TranslateSettings
): string {
    if (key == null || key == '') {
        return '';
    }
    let getEntry = (key: TranslateKey) =>
        getDictionaryEntry(key, dictionary, settings?.fallbackDictionary);

    return translate_(
        key,
        getEntry,
        dynamicProps,
        settings?.fallback,
        settings?.dynamicCache,
        settings?.absentCache,
        {
            $less:
                settings?.$less !== undefined
                    ? settings?.$less
                    : globalSettings.$less
        }
    );
}
