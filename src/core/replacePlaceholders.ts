import { replacePlaceholdersRegex_$less } from './global';
import { DictionaryEntry, Plurals, TranslateDynamicProps } from './types';

//import { translate } from "./translate";
//import { tryToPluralizeAndReplace } from "./tryToPluralizeAndReplace";

export function replacePlaceholders(
    replacePlaceholdersRegex: RegExp,
    value: string,
    entry: DictionaryEntry | string,
    dynamicProps: TranslateDynamicProps | undefined,
    handleTranslate: (value: string, fallback?: string) => string,
    handlePluralize: (
        value: string | number,
        prop: string,
        plurals: Plurals
    ) => string
) {
    var replaced: string = value.replace(
        replacePlaceholdersRegex,
        (
            all: string,
            replaceDynamic: string | undefined,
            shouldTranslate: string | undefined,
            prop: string,
            propAll: string,
            propFallback: string | undefined,
            ind: number,
            text: string
        ) => {
            var replaceValue: string | number | undefined;
            const shouldReplaceDynamic = replaceDynamic
                ? replaceDynamic
                : replacePlaceholdersRegex === replacePlaceholdersRegex_$less;
            if (shouldReplaceDynamic) {
                if (
                    dynamicProps &&
                    Object.prototype.hasOwnProperty.call(dynamicProps, prop)
                ) {
                    replaceValue = dynamicProps![prop];
                }
                if (replaceValue === undefined) {
                    replaceValue = propFallback || prop;
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
                    prop,
                    entry.plural
                );
                if (replaceValue.indexOf('{') >= 0) {
                    // replace again
                    replaceValue = replacePlaceholders(
                        replacePlaceholdersRegex,
                        replaceValue,
                        entry,
                        dynamicProps,
                        handleTranslate,
                        handlePluralize
                    );
                }
                // replaceValue = tryToPluralizeAndReplace(
                //     replacePlaceholdersRegex,
                //     prop,
                //     replaceValue,
                //     entry,
                //     getEntry,
                //     entry.plural,
                //     dynamicProps
                // );
                // return replaceValue;
            }
            if (shouldTranslate) {
                replaceValue = handleTranslate(replaceValue as string);
                // replaceValue = translate(
                //     replaceValue as string,
                //     getEntry,
                //     undefined,
                //     propFallback,
                //     replacePlaceholdersRegex,
                //     undefined,
                //     undefined
                // );
            }

            return '' + replaceValue || prop;
        }
    );
    return replaced;
}
