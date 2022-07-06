import { CaseOptions, Cases, PluralOptions, Plurals, TranslateDynamicProps } from './types';
import { SimpleTranslateFunc } from './types';

//import { translate } from "./translate";
//import { tryToPluralizeAndReplace } from "./tryToPluralizeAndReplace";

export function replacePlaceholders(
    _regexp: RegExp,
    value: string,
    plurals: Plurals | undefined,
    cases: Cases | undefined,
    dynamicProps: TranslateDynamicProps | undefined,
    handleTranslate: SimpleTranslateFunc | undefined,
    handlePluralize: ((value: string | number | boolean, plural: PluralOptions) => string) | undefined,
    handleCases: ((value: any, caseOptions: CaseOptions) => string) | undefined,
    settings: {
        shouldReplaceDynamic?: (placeholderPrefix: string, placeholder: string) => boolean;
        shouldTranslate?: (placeholderPrefix: string, placeholder: string) => boolean;
        shouldUseCases?: (placeholderPrefix: string, placeholder: string) => boolean;
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
            let replaceValue: string | number | boolean | undefined;
            let replaceAgain = false;
            const shouldReplaceDynamic =
                settings.shouldReplaceDynamic && settings.shouldReplaceDynamic(replaceAndOrTranslate, prop);
            if (shouldReplaceDynamic) {
                if (dynamicProps && Object.prototype.hasOwnProperty.call(dynamicProps, prop)) {
                    replaceValue = dynamicProps![prop];
                }
                if (replaceValue == null) {
                    replaceValue = propFallback;
                }
            } else {
                replaceValue = prop;
            }
            const shouldUseCases =
                cases && handleCases && settings.shouldUseCases && settings.shouldUseCases(replaceAndOrTranslate, prop);
            if (shouldUseCases) {
                replaceValue = handleCases(replaceValue, cases[prop]);
                // replace again
                if (replaceValue?.indexOf('{') >= 0) {
                    replaceAgain = true;
                }
            }

            const shouldPluralize =
                plurals && handlePluralize && shouldReplaceDynamic && !isNaN(replaceValue as number);
            if (shouldPluralize) {
                replaceValue = handlePluralize(replaceValue ?? '', plurals[prop]);
                // replace again
                if (replaceValue.indexOf('{') >= 0) {
                    replaceAgain = true;
                }
            }

            if (replaceAgain && typeof replaceValue === 'string') {
                if (replaceValue?.indexOf('{') >= 0) {
                    replaceValue = replacePlaceholders(
                        _regexp,
                        replaceValue,
                        plurals,
                        cases,
                        dynamicProps,
                        handleTranslate,
                        handlePluralize,
                        handleCases,
                        settings
                    );
                }
            }

            const shouldTranslate = settings.shouldTranslate && settings.shouldTranslate(replaceAndOrTranslate, prop);

            if (handleTranslate && shouldTranslate) {
                replaceValue = handleTranslate(replaceValue as string, dynamicProps);
            }

            return String(replaceValue ?? '');
        }
    );
    return replaced;
}
