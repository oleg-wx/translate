import { getFallbackValueOrKey } from './fallbackValueOrKey';
import { TranslateDynamicProps, TranslateInternalSettings, TranslateKey } from './types';
import { replacePlaceholders } from './replacePlaceholders';
import { pluralize } from './pluralize';
import { GetDictionaryEntry, TranslationKey } from './translationKey';

function getDynamicKey(key: string, dynamicProps: TranslateDynamicProps) {
    return `${key}::${JSON.stringify(dynamicProps).replace(/[\"\{\}]/g, '')}`;
}

export function translate(
    key: TranslateKey,
    getEntry: GetDictionaryEntry,
    dynamicProps: TranslateDynamicProps | undefined,
    fallback: string | undefined,
    dynamicCache: { [key: string]: string } | undefined,
    absentCache: string[] | undefined,
    settings: TranslateInternalSettings
) {
    // guard from wrong key
    if (typeof key !== 'string' && !Array.isArray(key) && typeof key !== 'number') {
        throw new Error('"key" parameter is required');
    }
    const _key = new TranslationKey(key);
    var entry = getEntry(_key);
    let fallingBack = false;
    if (!entry) {
        entry = getFallbackValueOrKey(_key, fallback, absentCache, settings);
        fallingBack = true;
    }

    const value = typeof entry === 'string' ? entry : entry?.value;

    // trying to speed up when no dynamic values present and probably(!) no placeholders
    if (!dynamicProps && value.indexOf('{') < 0) return value;

    // trying to get dynamic cache
    let dynamicKey: string | undefined;
    if (dynamicCache && dynamicProps && !fallingBack) {
        dynamicKey = getDynamicKey(value, dynamicProps);
        if (Object.prototype.hasOwnProperty.call(dynamicCache, dynamicKey)) {
            return dynamicCache[dynamicKey];
        }
    }

    const result = replacePlaceholders(
        entry,
        dynamicProps,
        (value, fallback) =>
            translate(
                value,
                getEntry,
                dynamicProps,
                fallback,
                undefined,
                absentCache,
                settings
            ),
        (value, plurals) => pluralize(value, plurals),
        settings
    );

    // cache translation
    if (dynamicCache && dynamicKey && !fallingBack) {
        dynamicCache[`${dynamicKey}`] = result;
    }
    return result;
}
