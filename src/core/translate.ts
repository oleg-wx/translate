import { getFallbackValueOrKey } from './fallbackValueOrKey';
import {
    Dictionaries,
    SimpleDictionaries,
    TranslateDynamicProps,
    TranslateInternalSettings,
    TranslateKey,
} from './types';
import { replacePlaceholders } from './replacePlaceholders';
import { pluralize } from './pluralize';
import { GetDictionaryEntry, TranslateKeyInstance } from './translationKey';

function createDynamicKey(key: string, dynamicProps: TranslateDynamicProps) {
    return `${key}::${JSON.stringify(dynamicProps).replace(/[\"\{\}]/g, '')}`;
}

export function translate(
    dictionaries: Dictionaries,
    lang: string,
    key: TranslateKey,
    getEntry: GetDictionaryEntry,
    dynamicProps: TranslateDynamicProps | undefined,
    fallbackLang: string | undefined,
    fallback: string | undefined,
    dynamicCache: SimpleDictionaries | undefined,
    settings: TranslateInternalSettings
) {
    // guard from wrong key
    if (
        typeof key !== 'string' &&
        !Array.isArray(key) &&
        typeof key !== 'number'
    ) {
        throw new Error('"key" parameter is required');
    }
    const _key = new TranslateKeyInstance(key);

    let fallingBack = false;
    var entry = getEntry(lang, _key);
    if (!entry) {
        if (fallbackLang) {
            entry = getEntry(fallbackLang, _key);
        }
        if (!entry) {
            entry = getFallbackValueOrKey(_key, fallback);
            fallingBack = true;
        }
    }

    const value = typeof entry === 'string' ? entry : entry?.value;

    // trying to speed up when no dynamic values present and probably(!) no placeholders
    if (!dynamicProps && value.indexOf('{') < 0) return value;

    // trying to get dynamic cache
    let dynamicKey: string | undefined;
    if (dynamicCache && dynamicProps && !fallingBack) {
        dynamicKey = createDynamicKey(value, dynamicProps);
        if (Object.prototype.hasOwnProperty.call(dynamicCache, dynamicKey)) {
            return dynamicCache[lang][dynamicKey];
        }
    }

    const result = replacePlaceholders(
        entry,
        dynamicProps,
        (value, fallback) =>
            translate(
                dictionaries,
                lang,
                value,
                getEntry,
                dynamicProps,
                fallback,
                fallbackLang,
                undefined,
                settings
            ),
        (value, plurals) => pluralize(value, plurals),
        settings
    );

    // cache translation
    if (dynamicCache && dynamicKey && !fallingBack) {
        if(!dynamicCache[lang]) dynamicCache[lang] = {};
        dynamicCache[lang][`${dynamicKey}`] = result;
    }
    return result;
}
