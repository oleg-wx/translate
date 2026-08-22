import { Operator } from "../types";

const intlMap = new Map<string, Intl.PluralRules>();

/**
 * `Intl.PluralRules` negotiates the locale on construction, which is far too expensive to redo
 * for every placeholder, so instances are memoised per locale. They cannot simply be closed over
 * by the matcher: matchers are memoised per expression and shared across every language, so they
 * have to stay locale-agnostic and take the locale at match time.
 */
function getPluralRules(locale: string): Intl.PluralRules {
    let intl = intlMap.get(locale);

    if (!intl) {
        try {
            intl = new Intl.PluralRules(locale);
        } catch (e) {
            throw new Error(`invalid locale for CLDR: "${locale}"`);
        }
        intlMap.set(locale, intl);
    }

    return intl;
}

// "other" is same as _
export class CldrOperator implements Operator {
    private _rx = new RegExp(`^\\s*(zero|one|two|few|many)\\s*$`, 'i');
    test(operation: string) {
        this._rx.lastIndex = 0;
        return this._rx.test(operation);
    }

    exec(operation: string): (value: string | number | boolean | Date, locale?: string) => boolean {
        this._rx.lastIndex = 0;
        const match = this._rx.exec(operation);
        if (match) {
            const selector = match[1].toLowerCase();
            return function (val, locale?: string) {
                if (!locale) {
                    // With no locale there is no category to ask for. Fall through to the
                    // remaining rules rather than guessing with the runtime's default locale,
                    // which would make the result depend on the machine.
                    return false;
                }

                const value = Number(val);

                if (isNaN(value)) {
                    return false;
                }

                return getPluralRules(locale).select(value) === selector;
            };
        } else {
            throw new Error(`wrong CLDR format: "${operation}"`);
        }
    }
}

export const cldrOperator = new CldrOperator();
