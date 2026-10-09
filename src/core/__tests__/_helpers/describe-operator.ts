import { Operator } from '../../types';

export type OperatorValue = string | number | boolean | Date;

/** One operator expression plus the values it must accept and reject. */
export interface OperatorExpression {
    expression: string;
    matches: OperatorValue[];
    rejects: OperatorValue[];
}

/**
 * Declares a suite per operator expression, compiling it once — exactly the way the plural
 * and case matchers do — and then asserting every value it should accept and reject.
 */
export function describeOperator(name: string, operator: Operator, expressions: OperatorExpression[]): void {
    describe(`[${name}] operator`, () => {
        describe.each(expressions)('"$expression"', ({ expression, matches, rejects }) => {
            const matcher = operator.exec(expression);

            if (matches.length) {
                it.each(matches)('matches %p', (value) => {
                    expect(matcher(value)).toBe(true);
                });
            }

            if (rejects.length) {
                it.each(rejects)('rejects %p', (value) => {
                    expect(matcher(value)).toBe(false);
                });
            }
        });
    });
}
