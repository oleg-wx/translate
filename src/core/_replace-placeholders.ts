import {
    PluralOptions,
    Plurals,
    TranslateDynamicProps,
} from './types';
import { SimpleTranslateFunc } from './types';

//import { translate } from "./translate";
//import { tryToPluralizeAndReplace } from "./tryToPluralizeAndReplace";

export function replacePlaceholders(
    _regexp: RegExp,
    value: string,
    plurals: Plurals | undefined,
    dynamicProps: TranslateDynamicProps | undefined,
    handleTranslate: SimpleTranslateFunc | undefined,
    handlePluralize:
        | ((value: string | number, plural: PluralOptions) => string)
        | undefined,
    settings: {
        shouldReplaceDynamic?: (
            placeholderPrefix: string,
            placeholder: string
        ) => boolean;
        shouldTranslate?: (
            placeholderPrefix: string,
            placeholder: string
        ) => boolean;
    }
) {
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
                settings.shouldReplaceDynamic &&
                settings.shouldReplaceDynamic(replaceAndOrTranslate, prop);
            const shouldTranslate =
                settings.shouldTranslate &&
                settings.shouldTranslate(replaceAndOrTranslate, prop);
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
                handlePluralize &&
                shouldReplaceDynamic &&
                plurals &&
                !isNaN(replaceValue as number)
            ) {
                replaceValue = handlePluralize(replaceValue, plurals[prop]);
                if (replaceValue.indexOf('{') >= 0) {
                    // replace again
                    replaceValue = replacePlaceholders(
                        _regexp,
                        replaceValue,
                        plurals,
                        dynamicProps,
                        handleTranslate,
                        handlePluralize,
                        settings
                    );
                }
            }
            if (handleTranslate && shouldTranslate) {
                replaceValue = handleTranslate(replaceValue as string);
            }

            return '' + replaceValue ?? prop;
        }
    );
    return replaced;
}
