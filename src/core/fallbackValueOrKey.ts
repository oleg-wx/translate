import { TranslateKeyInstance } from './translationKey';

export function getFallbackValueOrKey(
    key: TranslateKeyInstance,
    fallbackValue: string | undefined
): string {
    if (key == undefined) {
        return '';
    }
    const result = fallbackValue ?? key.asString;
    return result;
}
