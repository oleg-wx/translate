import { inOperator, betweenOperator, remainderOperator, endsWithOperator, startsWithOperator } from './operators';

describe(`test operators`, () => {
    it('should execute "in" operator', () => {
        let fn = inOperator.exec('in [1,2,3]');
        expect(fn(1)).toBeTruthy();
        expect(fn(2)).toBeTruthy();
        expect(fn(3)).toBeTruthy();
        expect(fn(4)).toBeFalsy();
        expect(fn(0)).toBeFalsy();
        expect(fn(12)).toBeFalsy();
        expect(fn(1.2)).toBeFalsy();

        fn = inOperator.exec('in [1.1, 2.2]');
        expect(fn(1.1)).toBeTruthy();
        expect(fn(2.2)).toBeTruthy();
        expect(fn(1)).toBeFalsy();
        expect(fn(2)).toBeFalsy();
    });

    it('should execute "between" operator', () => {
        let fn = betweenOperator.exec('between 1 and 3');
        expect(fn(1)).toBeTruthy();
        expect(fn(2)).toBeTruthy();
        expect(fn(2.5)).toBeTruthy();
        expect(fn(3)).toBeTruthy();
        expect(fn(4)).toBeFalsy();
        expect(fn(0)).toBeFalsy();
        expect(fn(13)).toBeFalsy();
        expect(fn(3.1)).toBeFalsy();

        fn = betweenOperator.exec('between 1.5 and 3.5');
        expect(fn(1.5)).toBeTruthy();
        expect(fn(2)).toBeTruthy();
        expect(fn(3.5)).toBeTruthy();
        expect(fn(1)).toBeFalsy();
        expect(fn(1.4)).toBeFalsy();
        expect(fn(3.6)).toBeFalsy();
        expect(fn(4)).toBeFalsy();
    });

    it('should execute "% (reminder)" operator', () => {
        let fn = remainderOperator.exec('%2');
        expect(fn(2)).toBeTruthy();
        expect(fn(0)).toBeTruthy();
        expect(fn(12)).toBeTruthy();
        expect(fn(6)).toBeTruthy();
        expect(fn(3)).toBeFalsy();
        expect(fn(1)).toBeFalsy();
        expect(fn(9)).toBeFalsy();

        fn = remainderOperator.exec('% 2');
        expect(fn(2)).toBeTruthy();
        expect(fn(3)).toBeFalsy();

        fn = remainderOperator.exec('%0');
        expect(fn(9)).toBeFalsy();
        expect(fn(10)).toBeFalsy();
        expect(fn(11)).toBeFalsy();

        fn = remainderOperator.exec('% 1.5');
        expect(fn(1.5)).toBeTruthy();
        expect(fn(3)).toBeTruthy();
        expect(fn(2)).toBeFalsy();
        expect(fn(4)).toBeFalsy();

        fn = remainderOperator.exec('% 1 = 0.5');
        expect(fn(1.5)).toBeTruthy();
        expect(fn(2.5)).toBeTruthy();
        expect(fn(3)).toBeFalsy();
        expect(fn(3.3)).toBeFalsy();

        fn = remainderOperator.exec('%7.5=3');
        expect(fn(10.5)).toBeTruthy();
        expect(fn(10)).toBeFalsy();
    });

    it('should execute "ends" operator', () => {
        let fn = endsWithOperator.exec('...2');
        expect(fn(0.2)).toBeTruthy();
        expect(fn(2)).toBeTruthy();
        expect(fn(22)).toBeTruthy();
        expect(fn(142)).toBeTruthy();
        expect(fn(21)).toBeFalsy();
        expect(fn(120)).toBeFalsy();
        expect(fn(4)).toBeFalsy();
        expect(fn(20)).toBeFalsy();
    });

    it('should execute "ends" operator with string', () => {
        let fn = endsWithOperator.exec('...ab');
        expect(fn('ab')).toBeTruthy();
        expect(fn('arab')).toBeTruthy();
        expect(fn('??..ab')).toBeTruthy();
        expect(fn('??ab')).toBeTruthy();
        expect(fn('abba')).toBeFalsy();
        expect(fn('mab??')).toBeFalsy();
        expect(fn('mab..')).toBeFalsy();
    });

    it('should execute [starts] operator', () => {
        let fn = startsWithOperator.exec('2...');
        expect(fn(2.0)).toBeTruthy();
        expect(fn(20)).toBeTruthy();
        expect(fn(2)).toBeTruthy();
        expect(fn(22)).toBeTruthy();
        expect(fn(241)).toBeTruthy();
        expect(fn(12)).toBeFalsy();
        expect(fn(120)).toBeFalsy();
        expect(fn(4)).toBeFalsy();
        expect(fn(0.2)).toBeFalsy();
    });

    it('should execute [start] operator with string', () => {
        let fn = startsWithOperator.exec('ab...');
        expect(fn('ab')).toBeTruthy();
        expect(fn('abar')).toBeTruthy();
        expect(fn('ab...??')).toBeTruthy();
        expect(fn('ab??')).toBeTruthy();
        expect(fn('b...')).toBeFalsy();
        expect(fn('bab')).toBeFalsy();
        expect(fn('mab..')).toBeFalsy();
        expect(fn('...aa')).toBeFalsy();
    });
});
