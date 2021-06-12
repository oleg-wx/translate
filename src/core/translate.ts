import { getFallbackValueOrKey } from "./fallbackValueOrKey";
import { namespaceSeparator } from "./global";
import { GetDictionaryEntry, TranslateDynamicProps, TranslateKey } from "./types";
import { replacePlaceholders } from "./replacePlaceholders";
import { pluralize } from "./pluralize";

function getDynamicKey(key: string, dynamicProps: TranslateDynamicProps) {
    return `${key}::${JSON.stringify(dynamicProps).replace(/[\"\{\}]/g, '')}`;
}

export function translate(
    key: TranslateKey,
    getEntry: GetDictionaryEntry,
    dynamicProps: TranslateDynamicProps | undefined,
    fallback: string | undefined,
    replacePlaceholdersRegex: RegExp,
    dynamicCache: { [key: string]: string } | undefined,
    absentCache: string[] | undefined
) {
    // to satisfy type check and 0 value
    if (typeof key === 'number') {
        key = '' + key;
    }
    // guard from wrong key
    if (typeof key !== 'string' && !Array.isArray(key)) {
        throw new Error('"key" parameter is required');
    }
    // separate key by namespace namespace
    if (typeof key === 'string' && key.indexOf(':') >= 0) {
        key = key.split(namespaceSeparator).reduce((res, val) => {
            val && res.push(val.trim());
            return res;
        }, [] as string[]);
    }

    // as regex is global
    replacePlaceholdersRegex.lastIndex = 0;

    var entry = getEntry(key);
    let fallingBack = false;
    if (!entry) {
        entry = getFallbackValueOrKey(key, fallback, absentCache);
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
        replacePlaceholdersRegex,
        value,
        entry,
        dynamicProps,
        (value, fallback)=>translate(value,getEntry,dynamicProps,fallback,replacePlaceholdersRegex,undefined,absentCache),
        (value,prop,plurals)=>pluralize(value,prop,plurals),
    );

    // cache translation
    if (dynamicCache && dynamicKey && !fallingBack) {
        dynamicCache[`${dynamicKey}`] = result;
    }
    return result;
}