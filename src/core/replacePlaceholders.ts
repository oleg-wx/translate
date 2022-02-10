import globalSettings from './globalSettings';
import {
    DictionaryEntry,
    PluralOptions,
    TranslateDynamicProps,
    TranslateInternalSettings,
} from './types';

//import { translate } from "./translate";
//import { tryToPluralizeAndReplace } from "./tryToPluralizeAndReplace";

export function replacePlaceholders(
    entry: DictionaryEntry | string,
    dynamicProps: TranslateDynamicProps | undefined,
    handleTranslate: (value: string, fallback?: string) => string,
    handlePluralize: (
        value: string | number,
        plural: PluralOptions
    ) => string,
    settings?: TranslateInternalSettings
) {
    var _settings = settings ?? globalSettings;
    var value: string;
    if (typeof entry === 'string') {
        value = entry;
    } else {
        value = entry.value;
    }
    var _regexp = _settings.$less
        ? globalSettings.replacePlaceholdersRx_$less
        : globalSettings.replacePlaceholdersRx;
    var replaced: string = value.replace(
        _regexp,
        (
            all: string,
            replaceAndOrTranslate: string,
            prop: string,
            propAll: string,
            propFallback: string | undefined,
            ind: number,
            text: string
        ) => {
            var replaceValue: string | number | undefined;
            const shouldReplaceDynamic =
                replaceAndOrTranslate?.indexOf('$') >= 0 || _settings.$less;
            const shouldTranslate = replaceAndOrTranslate?.indexOf('&') >= 0;
            if (shouldReplaceDynamic) {
                if (
                    dynamicProps &&
                    Object.prototype.hasOwnProperty.call(dynamicProps, prop)
                ) {
                    replaceValue = dynamicProps![prop];
                }
                if (replaceValue === undefined) {
                    replaceValue = propFallback ?? prop;
                }
            } else {
                replaceValue = prop;
            }

            if (
                shouldReplaceDynamic &&
                typeof entry !== 'string' &&
                entry?.plural &&
                !isNaN(replaceValue as number)
            ) {
                replaceValue = handlePluralize(
                    replaceValue,
                    entry.plural[prop]
                );
                if (replaceValue.indexOf('{') >= 0) {
                    // replace again
                    replaceValue = replacePlaceholders(
                        replaceValue,
                        dynamicProps,
                        handleTranslate,
                        handlePluralize,
                        settings
                    );
                }
            }
            if (shouldTranslate) {
                replaceValue = handleTranslate(replaceValue as string);
            }

            return '' + replaceValue ?? prop;
        }
    );
    return replaced;
}
