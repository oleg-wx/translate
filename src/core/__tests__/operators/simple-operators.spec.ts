import { compareOperator, truthyFalsyOperator } from '../../operators/simple-operators';
import { describeOperator } from '../_helpers/describe-operator';

describeOperator('truthy / falsy', truthyFalsyOperator, [
    {
        expression: '!!',
        matches: [2, -2, 'a', true],
        rejects: [0, false, '', undefined!, null!],
    },
    {
        expression: '!',
        matches: [0, false, '', undefined!, null!],
        rejects: [2, -2, 'a', true],
    },
]);

// `=` and `==` are the same operator; both are covered so a future split cannot go unnoticed.
describeOperator('= (numbers)', compareOperator, [
    {
        expression: '=2',
        matches: [2],
        rejects: [1, 0, 3, 4, 22, 2.2, 1.8],
    },
    {
        expression: '=2.2',
        matches: [2.2],
        rejects: [2, 3],
    },
]);

describeOperator('== (numbers)', compareOperator, [
    {
        expression: '==2',
        matches: [2],
        rejects: [1, 0, 3, 4, 22, 2.2, 1.8],
    },
    {
        expression: '==2.2',
        matches: [2.2],
        rejects: [2, 3],
    },
]);

describeOperator('= (strings)', compareOperator, [
    {
        expression: '=abba',
        matches: ['abba'],
        rejects: ['a', 'ab', 'ba', 'b', 'baab', 'baba', '20250'],
    },
    {
        expression: '=aa.bb',
        matches: ['aa.bb'],
        rejects: ['a.b', 'aa.', '.bb'],
    },
]);

describeOperator('== (strings)', compareOperator, [
    {
        expression: '==abba',
        matches: ['abba'],
        rejects: ['a', 'ab', 'ba', 'b', 'baab', 'baba', '20250'],
    },
    {
        expression: '==aa.bb',
        matches: ['aa.bb'],
        rejects: ['a.b', 'aa.', '.bb'],
    },
]);

describeOperator('<', compareOperator, [
    {
        expression: '< 1',
        matches: [-1, 0],
        rejects: [1, 11],
    },
    {
        expression: '< 10',
        matches: [9],
        rejects: [10, 11],
    },
    {
        expression: '< 180',
        matches: [90, 179],
        rejects: [180, 181],
    },
    {
        expression: '< -1',
        matches: [-2],
        rejects: [0, -1],
    },
    {
        expression: '< 1.5',
        matches: [-1, 0, 1, 1.4],
        rejects: [1.5, 1.6, 2],
    },
]);

describeOperator('>', compareOperator, [
    {
        expression: '> 1',
        matches: [2],
        rejects: [1],
    },
    {
        expression: '> 10',
        matches: [11],
        rejects: [9],
    },
    {
        expression: '> 180',
        matches: [181],
        rejects: [90],
    },
    {
        expression: '> -1',
        matches: [0],
        rejects: [-2],
    },
    {
        expression: '> 1.5',
        matches: [1.6, 2],
        rejects: [-1, 0, 1, 1.4, 1.5],
    },
]);

describeOperator('>=', compareOperator, [
    {
        expression: '>= 1',
        matches: [2, 1, 1.1],
        rejects: [0, 0.9, -1],
    },
    {
        expression: '>= 10',
        matches: [11, 10],
        rejects: [9],
    },
    {
        expression: '>= 1.5',
        matches: [1.5, 2],
        rejects: [1, 1.4],
    },
]);

describeOperator('<=', compareOperator, [
    {
        expression: '<= 1',
        matches: [-1, 0, 1, 0.9],
        rejects: [2, 1.1],
    },
    {
        expression: '<= 10',
        matches: [9, 10],
        rejects: [11],
    },
    {
        expression: '<= 1.5',
        matches: [1.5, 1],
        rejects: [2, 1.6],
    },
]);
