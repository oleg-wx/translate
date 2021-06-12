import { namespaceSeparator } from './global';
import { TranslateKey } from './types';

export function getFallbackValueOrKey(
    key: TranslateKey,
    fallbackValue: string | undefined,
    absentCache: string[] | undefined
): string {
    if (key == undefined) {
        return '';
    }
    if (absentCache) {
        let absentKey =
            typeof key == 'string' ? key : key.join(namespaceSeparator);
        absentCache &&
            !Object.prototype.hasOwnProperty.call(absentCache, absentKey) &&
            absentCache.push(absentKey);
    }
    const result =
        fallbackValue ||
        (typeof key === 'string'
            ? (key as string)
            : Array.isArray(key)
            ? key.join(namespaceSeparator)
            : '' + key);
    return result;
}
