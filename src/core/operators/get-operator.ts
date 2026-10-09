import { Operator, OperatorMatcher } from '../types';

export function getOperatorFn(operation: string, operators: Operator[], errFn?: (operation: string) => Error): Operator {
    let operator = operators.find((o) => {
        return o.test(operation);
    });

    if (operator) return operator;

    throw errFn ? errFn(operation) : new Error(`operator "${operation}" not supported`);
}

/**
 * Compiles `operation` into a matcher, memoised by the expression itself.
 *
 * The cache is keyed on the expression rather than stored on the rule, because rules are
 * caller-owned data — a frozen dictionary has to stay usable — and because the same expression
 * recurs across many entries, so compiling once per expression beats once per rule.
 *
 * Each call site owns its cache. They support different operator lists, so a shared cache would
 * let a matcher compiled for a plural satisfy a case rule that is meant to be rejected.
 */
export function compileOperator(
    operation: string,
    operators: Operator[],
    cache: Map<string, OperatorMatcher>,
    errFn?: (operation: string) => Error
): OperatorMatcher {
    let matcher = cache.get(operation);

    if (!matcher) {
        matcher = getOperatorFn(operation, operators, errFn).exec(operation);
        cache.set(operation, matcher);
    }

    return matcher;
}
