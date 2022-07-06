import { compareOperator,truthyFalsyOperator } from './simple-operators';

describe(`test simple operators`, () => {
    it('should execute [!!] truthy operator', () => {
        let fn = truthyFalsyOperator.exec('!!');
        expect(fn(2)).toBeTruthy();
        expect(fn(-2)).toBeTruthy();
        expect(fn('a')).toBeTruthy();
        expect(fn(true)).toBeTruthy();

        expect(fn(0)).toBeFalsy();
        expect(fn(false)).toBeFalsy();
        expect(fn('')).toBeFalsy();
        expect(fn(undefined!)).toBeFalsy();
        expect(fn(null!)).toBeFalsy();
    });

    it('should execute [!] truthy operator', () => {
        let fn = truthyFalsyOperator.exec('!');
        expect(fn(0)).toBeTruthy();
        expect(fn(false)).toBeTruthy();
        expect(fn('')).toBeTruthy();
        expect(fn(undefined!)).toBeTruthy();
        expect(fn(null!)).toBeTruthy();

        expect(fn(2)).toBeFalsy();
        expect(fn(-2)).toBeFalsy();
        expect(fn('a')).toBeFalsy();
        expect(fn(true)).toBeFalsy();
    });

    it('should execute [=] operator with number', () => {
        let fn = compareOperator.exec('=2');
        expect(fn(2)).toBeTruthy();
        expect(fn(1)).toBeFalsy();
        expect(fn(0)).toBeFalsy();
        expect(fn(3)).toBeFalsy();
        expect(fn(4)).toBeFalsy();
        expect(fn(22)).toBeFalsy();
        expect(fn(2.2)).toBeFalsy();
        expect(fn(1.8)).toBeFalsy();

        fn = compareOperator.exec('=2.2');
        expect(fn(2.2)).toBeTruthy();
        expect(fn(2)).toBeFalsy();
        expect(fn(3)).toBeFalsy();
    });

    it(`should execute [==] operator with number`, () => {
        let fn = compareOperator.exec('==2');
        expect(fn(2)).toBeTruthy();
        expect(fn(1)).toBeFalsy();
        expect(fn(0)).toBeFalsy();
        expect(fn(3)).toBeFalsy();
        expect(fn(4)).toBeFalsy();
        expect(fn(22)).toBeFalsy();
        expect(fn(2.2)).toBeFalsy();
        expect(fn(1.8)).toBeFalsy();

        fn = compareOperator.exec('==2.2');
        expect(fn(2.2)).toBeTruthy();
        expect(fn(2)).toBeFalsy();
        expect(fn(3)).toBeFalsy();
    });

    it('should execute [<] operator with number', () => {
        let fn = compareOperator.exec('< 1');
        expect(fn(-1)).toBeTruthy();
        expect(fn(0)).toBeTruthy();
        expect(fn(1)).toBeFalsy();
        expect(fn(11)).toBeFalsy();

        fn = compareOperator.exec('< 10');
        expect(fn(9)).toBeTruthy();
        expect(fn(10)).toBeFalsy();
        expect(fn(11)).toBeFalsy();

        fn = compareOperator.exec('< 180');
        expect(fn(90)).toBeTruthy();
        expect(fn(179)).toBeTruthy();
        expect(fn(180)).toBeFalsy();
        expect(fn(181)).toBeFalsy();

        fn = compareOperator.exec('< -1');
        expect(fn(-2)).toBeTruthy();
        expect(fn(0)).toBeFalsy();
        expect(fn(-1)).toBeFalsy();

        fn = compareOperator.exec('< 1.5');
        expect(fn(-1)).toBeTruthy();
        expect(fn(0)).toBeTruthy();
        expect(fn(1)).toBeTruthy();
        expect(fn(1.4)).toBeTruthy();
        expect(fn(1.5)).toBeFalsy();
        expect(fn(1.6)).toBeFalsy();
        expect(fn(2)).toBeFalsy();
    });

    it('should execute [>] operator with number', () => {
        let fn = compareOperator.exec('> 1');
        expect(fn(2)).toBeTruthy();
        expect(fn(1)).toBeFalsy();

        fn = compareOperator.exec('> 10');
        expect(fn(11)).toBeTruthy();
        expect(fn(9)).toBeFalsy();

        fn = compareOperator.exec('> 180');
        expect(fn(181)).toBeTruthy();
        expect(fn(90)).toBeFalsy();

        fn = compareOperator.exec('> -1');
        expect(fn(0)).toBeTruthy();
        expect(fn(-2)).toBeFalsy();

        fn = compareOperator.exec('> 1.5');
        expect(fn(-1)).toBeFalsy();
        expect(fn(0)).toBeFalsy();
        expect(fn(1)).toBeFalsy();
        expect(fn(1.4)).toBeFalsy();
        expect(fn(1.5)).toBeFalsy();
        expect(fn(1.6)).toBeTruthy();
        expect(fn(2)).toBeTruthy();
    });

    it('should execute [>=] operator with number', () => {
        let fn = compareOperator.exec('>= 1');
        expect(fn(2)).toBeTruthy();
        expect(fn(1)).toBeTruthy();
        expect(fn(1.1)).toBeTruthy();
        expect(fn(0)).toBeFalsy();
        expect(fn(0.9)).toBeFalsy();
        expect(fn(-1)).toBeFalsy();

        fn = compareOperator.exec('>= 10');
        expect(fn(11)).toBeTruthy();
        expect(fn(10)).toBeTruthy();
        expect(fn(9)).toBeFalsy();

        fn = compareOperator.exec('>= 1.5');
        expect(fn(1.5)).toBeTruthy();
        expect(fn(2)).toBeTruthy();
        expect(fn(1)).toBeFalsy();
        expect(fn(1.4)).toBeFalsy();
    });

    it('should execute [<=] operator with number', () => {
        let fn = compareOperator.exec('<= 1');
        expect(fn(-1)).toBeTruthy();
        expect(fn(0)).toBeTruthy();
        expect(fn(1)).toBeTruthy();
        expect(fn(0.9)).toBeTruthy();
        expect(fn(2)).toBeFalsy();
        expect(fn(1.1)).toBeFalsy();

        fn = compareOperator.exec('<= 10');
        expect(fn(9)).toBeTruthy();
        expect(fn(10)).toBeTruthy();
        expect(fn(11)).toBeFalsy();

        fn = compareOperator.exec('<= 1.5');
        expect(fn(1.5)).toBeTruthy();
        expect(fn(1)).toBeTruthy();
        expect(fn(2)).toBeFalsy();
        expect(fn(1.6)).toBeFalsy();
    });

    it('should execute [=] operator with string', () => {
        let fn = compareOperator.exec('=abba');
        expect(fn('abba')).toBeTruthy();

        expect(fn('a')).toBeFalsy();
        expect(fn('ab')).toBeFalsy();
        expect(fn('ba')).toBeFalsy();
        expect(fn('b')).toBeFalsy();
        expect(fn('baab')).toBeFalsy();
        expect(fn('baba')).toBeFalsy();
        expect(fn('20250')).toBeFalsy();

        fn = compareOperator.exec('=aa.bb');
        expect(fn('aa.bb')).toBeTruthy();
        expect(fn('a.b')).toBeFalsy();
        expect(fn('aa.')).toBeFalsy();
        expect(fn('.bb')).toBeFalsy();
    });

    it(`should execute [==] operator with string`, () => {
        let fn = compareOperator.exec('==abba');
        expect(fn('abba')).toBeTruthy();

        expect(fn('a')).toBeFalsy();
        expect(fn('ab')).toBeFalsy();
        expect(fn('ba')).toBeFalsy();
        expect(fn('b')).toBeFalsy();
        expect(fn('baab')).toBeFalsy();
        expect(fn('baba')).toBeFalsy();
        expect(fn('20250')).toBeFalsy();

        fn = compareOperator.exec('==aa.bb');
        expect(fn('aa.bb')).toBeTruthy();
        expect(fn('a.b')).toBeFalsy();
        expect(fn('aa.')).toBeFalsy();
        expect(fn('.bb')).toBeFalsy();
    });
});
