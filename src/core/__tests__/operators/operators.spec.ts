import {
    betweenOperator,
    endsWithOperator,
    inOperator,
    remainderOperator,
    startsWithOperator,
} from '../../operators/operators';
import { describeOperator } from '../_helpers/describe-operator';

describeOperator('in', inOperator, [
    {
        expression: 'in [1,2,3]',
        matches: [1, 2, 3],
        rejects: [4, 0, 12, 1.2],
    },
    {
        expression: 'in [1.1, 2.2]',
        matches: [1.1, 2.2],
        rejects: [1, 2],
    },
]);

describeOperator('between', betweenOperator, [
    {
        // Both bounds are inclusive.
        expression: 'between 1 and 3',
        matches: [1, 2, 2.5, 3],
        rejects: [4, 0, 13, 3.1],
    },
    {
        expression: 'between 1.5 and 3.5',
        matches: [1.5, 2, 3.5],
        rejects: [1, 1.4, 3.6, 4],
    },
]);

describeOperator('% (remainder)', remainderOperator, [
    {
        expression: '%2',
        matches: [2, 0, 12, 6],
        rejects: [3, 1, 9],
    },
    {
        // Whitespace after `%` is allowed.
        expression: '% 2',
        matches: [2],
        rejects: [3],
    },
    {
        // `x % 0` is NaN, which equals nothing — so this expression never matches.
        expression: '%0',
        matches: [],
        rejects: [9, 10, 11],
    },
    {
        expression: '% 1.5',
        matches: [1.5, 3],
        rejects: [2, 4],
    },
    {
        // `= n` compares the remainder against `n` instead of the default 0.
        expression: '% 1 = 0.5',
        matches: [1.5, 2.5],
        rejects: [3, 3.3],
    },
    {
        expression: '%7.5=3',
        matches: [10.5],
        rejects: [10],
    },
]);

describeOperator('... (ends with)', endsWithOperator, [
    {
        expression: '...2',
        matches: [0.2, 2, 22, 142],
        rejects: [21, 120, 4, 20],
    },
    {
        expression: '...ab',
        matches: ['ab', 'arab', '??..ab', '??ab'],
        rejects: ['abba', 'mab??', 'mab..'],
    },
]);

describeOperator('... (starts with)', startsWithOperator, [
    {
        expression: '2...',
        // `2.0` stringifies to "2", so it starts with "2".
        matches: [2.0, 20, 2, 22, 241],
        rejects: [12, 120, 4, 0.2],
    },
    {
        expression: 'ab...',
        matches: ['ab', 'abar', 'ab...??', 'ab??'],
        rejects: ['b...', 'bab', 'mab..', '...aa'],
    },
]);
