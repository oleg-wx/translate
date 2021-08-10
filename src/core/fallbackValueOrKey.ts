import globalSettings from './globalSettings';
import { TranslationKey } from './translationKey';
import { TranslateInternalSettings } from './types';

export function getFallbackValueOrKey(
    key: TranslationKey,
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
        !absentCache.includes(absentKey) && absentCache.push(absentKey);
    }
    const result = fallbackValue || key.asString;
    return result;
}
