import globalSettings from './globalSettings';
import { TranslateKey } from './translationKey';
import { TranslateInternalSettings } from './types';

export function getFallbackValueOrKey(
    key: TranslateKey,
    fallbackValue: string | undefined,
    absentCache: string[] | undefined,
    options?: TranslateInternalSettings
): string {
    options = options || globalSettings;
    if (key == undefined) {
        return '';
    }
    if (absentCache) {
        let absentKey = key.asString;
        absentCache &&
            !Object.prototype.hasOwnProperty.call(absentCache, absentKey) &&
            absentCache.push(absentKey);
    }
    const result = fallbackValue || key.asString;
    return result;
}
