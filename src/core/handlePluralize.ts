import { cldrOperator } from './operators/cldr.operators';
import { compileOperator } from './operators/get-operator';
import {
    betweenOperator,
    endsWithOperator,
    inOperator,
    remainderOperator,
    startsWithOperator,
} from './operators/operators';
import { compareOperator, truthyFalsyOperator } from './operators/simple-operators';
import { Operator, OperatorMatcher, PluralOptions } from './types';

const operators: Operator[] = [
    cldrOperator,
    truthyFalsyOperator,
    compareOperator,
    inOperator,
    betweenOperator,
    remainderOperator,
    endsWithOperator,
    startsWithOperator,
];

/** Matchers compiled from the operator list above, and only from it. */
const matchers = new Map<string, OperatorMatcher>();

const numProps = '$#';
const regexNumProps = /\$\#/g;

export function handlePluralize(locale: string, value: string | number | boolean, pluralOptions: PluralOptions) {
    var pluralValues = pluralOptions;
    var pluralValue = numProps;
    if (pluralValues) {
        let num = +value;
        for (let i = 0; i < pluralValues.length; i++) {
            const [expression, template] = pluralValues[i];
            // `other` is CLDR's catch-all and means the same as `_`: remember it, but keep
            // looking, so a more specific rule declared later still wins.
            if (expression === '_' || expression === 'other') {
                pluralValue = template;
            } else if (compileOperator(expression, operators, matchers)(num, locale)) {
                pluralValue = template;
                break;
            }
        }
    }
    regexNumProps.lastIndex = 0;
    var replacedValue = pluralValue.replace(
        regexNumProps,
        (pattern: string, val: string, text: string) => value as string
    );
    return replacedValue;
}
