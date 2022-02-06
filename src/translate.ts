import {
    Dictionary,
    FailureCallback,
    SimpleDictionaries,
    TranslateDynamicProps,
    TranslateInternalSettings,
} from './core/types';
import { getDictionaryEntry } from './core/getDictionaryEntry';
import { translate as translate_ } from './core/translate';
import globalSettings from './core/globalSettings';
import { TranslateKey } from './core/types';
import { TranslateKeyInstance } from './core/translationKey';

export interface TranslateOptions extends Partial<TranslateInternalSettings> {
    fallbackLang?: string;
    fallback?: string | undefined;
    dynamicCache?: SimpleDictionaries | undefined;
    onFailure?: FailureCallback;
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
    lang: string,
    dictionaries: { [key: string]: Dictionary },
    key: TranslateKey,
    dynamicProps?: TranslateDynamicProps,
    settings?: TranslateOptions
): string {
    if (key == null || key == '') {
        return '';
    }
    let getEntry = (lang: string, key_: TranslateKeyInstance) => {
        const result = getDictionaryEntry(dictionaries, lang, key_);
        if (result === undefined) {
            if (typeof settings?.onFailure === 'function') {
                settings?.onFailure(lang, key);
            }
        }
        return result;
    };

    return translate_(
        dictionaries,
        lang,
        key,
        getEntry,
        dynamicProps,
        settings?.fallbackLang,
        settings?.fallback,
        settings?.dynamicCache,
        {
            $less:
                settings?.$less !== undefined
                    ? settings?.$less
                    : globalSettings.$less,
        }
    );
}
