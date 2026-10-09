import { compileOperator } from './operators/get-operator';
import { endsWithOperator, startsWithOperator } from './operators/operators';
import { truthyFalsyOperator, compareOperator } from './operators/simple-operators';
import { CaseOptions, Operator, OperatorMatcher } from './types';

const valProps = '$#';
const regexValProps = /\$\#/g;

// Cases match arbitrary values rather than counts, so the numeric operators — `in`, `between`,
// `%` and the CLDR categories — are deliberately absent here.
const operators: Operator[] = [truthyFalsyOperator, compareOperator, startsWithOperator, endsWithOperator];

/** Matchers compiled from the operator list above, and only from it. */
const matchers = new Map<string, OperatorMatcher>();

const unsupported = (operation: string) => new Error(`case operator "${operation}" not supported`);

export function handleCases(locale: string, value: any, options: CaseOptions) {
    let _values = options;
    let _value = valProps;
    if (_values) {
        for (let i = 0; i < _values.length; i++) {
            const [expression, template] = _values[i];
            // Remember the catch-all but keep looking, so a more specific rule declared
            // later still wins.
            if (expression === '_' || expression === 'other') {
                _value = template;
            } else if (compileOperator(expression, operators, matchers, unsupported)(value, locale)) {
                _value = template;
                break;
            }
        }
    }
    regexValProps.lastIndex = 0;
    var replacedValue = _value.replace(regexValProps, (pattern: string, val: string, text: string) => value as string);
    return replacedValue;
}
