import { compileFunction } from "../compile-function"

it('should compile and run "=" operator',()=>{
    let fn = compileFunction("=2");
    expect(fn(2)).toBeTruthy();
    expect(fn(1)).toBeFalsy();
    expect(fn(0)).toBeFalsy();
    expect(fn(3)).toBeFalsy();
    expect(fn(4)).toBeFalsy();
    expect(fn(22)).toBeFalsy();
    expect(fn(2.2)).toBeFalsy();
    expect(fn(1.8)).toBeFalsy();

    fn = compileFunction("=2.2");
    expect(fn(2.2)).toBeTruthy();
    expect(fn(2)).toBeFalsy();
    expect(fn(3)).toBeFalsy();

});
it('should compile and run "==" operator',()=>{
    let fn = compileFunction("==2");
    expect(fn(2)).toBeTruthy();
    expect(fn(1)).toBeFalsy();
    expect(fn(0)).toBeFalsy();
    expect(fn(3)).toBeFalsy();
    expect(fn(4)).toBeFalsy();
    expect(fn(22)).toBeFalsy();
    expect(fn(2.2)).toBeFalsy();
    expect(fn(1.8)).toBeFalsy();

    fn = compileFunction("==2.2");
    expect(fn(2.2)).toBeTruthy();
    expect(fn(2)).toBeFalsy();
    expect(fn(3)).toBeFalsy();
});

it('should compile and run "in" operator',()=>{
    let fn = compileFunction("in [1,2,3]");
    expect(fn(1)).toBeTruthy();
    expect(fn(2)).toBeTruthy();
    expect(fn(3)).toBeTruthy();
    expect(fn(4)).toBeFalsy();
    expect(fn(0)).toBeFalsy();
    expect(fn(12)).toBeFalsy();
    expect(fn(1.2)).toBeFalsy();

    fn = compileFunction("in [1.1, 2.2]");
    expect(fn(1.1)).toBeTruthy();
    expect(fn(2.2)).toBeTruthy();
    expect(fn(1)).toBeFalsy();
    expect(fn(2)).toBeFalsy();
});

it('should compile and run "between" operator',()=>{
    let fn = compileFunction("between 1 and 3");
    expect(fn(1)).toBeTruthy();
    expect(fn(2)).toBeTruthy();
    expect(fn(2.5)).toBeTruthy();
    expect(fn(3)).toBeTruthy();
    expect(fn(4)).toBeFalsy();
    expect(fn(0)).toBeFalsy();
    expect(fn(13)).toBeFalsy();
    expect(fn(3.1)).toBeFalsy();

    fn = compileFunction("between 1.5 and 3.5");
    expect(fn(1.5)).toBeTruthy();
    expect(fn(2)).toBeTruthy();
    expect(fn(3.5)).toBeTruthy();
    expect(fn(1)).toBeFalsy();
    expect(fn(1.4)).toBeFalsy();
    expect(fn(3.6)).toBeFalsy();
    expect(fn(4)).toBeFalsy();

});

it('should compile and run "<" operator',()=>{
    let fn = compileFunction("< 1");
    expect(fn(-1)).toBeTruthy();
    expect(fn(0)).toBeTruthy();
    expect(fn(1)).toBeFalsy();
    expect(fn(11)).toBeFalsy();

    fn = compileFunction("< 10");
    expect(fn(9)).toBeTruthy();
    expect(fn(10)).toBeFalsy();
    expect(fn(11)).toBeFalsy();

    fn = compileFunction("< 180");
    expect(fn(90)).toBeTruthy();
    expect(fn(179)).toBeTruthy();
    expect(fn(180)).toBeFalsy();
    expect(fn(181)).toBeFalsy();

    fn = compileFunction("< -1");
    expect(fn(-2)).toBeTruthy();
    expect(fn(0)).toBeFalsy();
    expect(fn(-1)).toBeFalsy();

    fn = compileFunction("< 1.5");
    expect(fn(-1)).toBeTruthy();
    expect(fn(0)).toBeTruthy();
    expect(fn(1)).toBeTruthy();
    expect(fn(1.4)).toBeTruthy();
    expect(fn(1.5)).toBeFalsy();
    expect(fn(1.6)).toBeFalsy();
    expect(fn(2)).toBeFalsy();
})

it('should compile and run ">" operator',()=>{
    let fn = compileFunction("> 1");
    expect(fn(2)).toBeTruthy();
    expect(fn(1)).toBeFalsy();

    fn = compileFunction("> 10");
    expect(fn(11)).toBeTruthy();
    expect(fn(9)).toBeFalsy();

    fn = compileFunction("> 180");
    expect(fn(181)).toBeTruthy();
    expect(fn(90)).toBeFalsy();

    fn = compileFunction("> -1");
    expect(fn(0)).toBeTruthy();
    expect(fn(-2)).toBeFalsy();

    fn = compileFunction("> 1.5");
    expect(fn(-1)).toBeFalsy();
    expect(fn(0)).toBeFalsy();
    expect(fn(1)).toBeFalsy();
    expect(fn(1.4)).toBeFalsy();
    expect(fn(1.5)).toBeFalsy();
    expect(fn(1.6)).toBeTruthy();
    expect(fn(2)).toBeTruthy();
})

it('should compile and run ">=" operator',()=>{
    let fn = compileFunction(">= 1");
    expect(fn(2)).toBeTruthy();
    expect(fn(1)).toBeTruthy();
    expect(fn(1.1)).toBeTruthy();
    expect(fn(0)).toBeFalsy();
    expect(fn(0.9)).toBeFalsy();
    expect(fn(-1)).toBeFalsy();

    fn = compileFunction(">= 10");
    expect(fn(11)).toBeTruthy();
    expect(fn(10)).toBeTruthy();
    expect(fn(9)).toBeFalsy();

    fn = compileFunction(">= 1.5");
    expect(fn(1.5)).toBeTruthy();
    expect(fn(2)).toBeTruthy();
    expect(fn(1)).toBeFalsy();
    expect(fn(1.4)).toBeFalsy();
})

it('should compile and run "<=" operator',()=>{
    let fn = compileFunction("<= 1");
    expect(fn(-1)).toBeTruthy();
    expect(fn(0)).toBeTruthy();
    expect(fn(1)).toBeTruthy();
    expect(fn(0.9)).toBeTruthy();
    expect(fn(2)).toBeFalsy();
    expect(fn(1.1)).toBeFalsy();

    fn = compileFunction("<= 10");
    expect(fn(9)).toBeTruthy();
    expect(fn(10)).toBeTruthy();
    expect(fn(11)).toBeFalsy();

    fn = compileFunction("<= 1.5");
    expect(fn(1.5)).toBeTruthy();
    expect(fn(1)).toBeTruthy();
    expect(fn(2)).toBeFalsy();
    expect(fn(1.6)).toBeFalsy();
})

it('should compile and run "% (reminder)" operator',()=>{
    let fn = compileFunction("%2");
    expect(fn(2)).toBeTruthy();
    expect(fn(0)).toBeTruthy();
    expect(fn(12)).toBeTruthy();
    expect(fn(6)).toBeTruthy();
    expect(fn(3)).toBeFalsy();
    expect(fn(1)).toBeFalsy();
    expect(fn(9)).toBeFalsy();

    fn = compileFunction("% 2");
    expect(fn(2)).toBeTruthy();
    expect(fn(3)).toBeFalsy();

    fn = compileFunction("%0");
    expect(fn(9)).toBeFalsy();
    expect(fn(10)).toBeFalsy();
    expect(fn(11)).toBeFalsy();

    fn = compileFunction("% 1.5");
    expect(fn(1.5)).toBeTruthy();
    expect(fn(3)).toBeTruthy();
    expect(fn(2)).toBeFalsy();
    expect(fn(4)).toBeFalsy();

    fn = compileFunction("% 1 = 0.5");
    expect(fn(1.5)).toBeTruthy();
    expect(fn(2.5)).toBeTruthy();
    expect(fn(3)).toBeFalsy();
    expect(fn(3.3)).toBeFalsy();

    fn = compileFunction("%7.5=3");
    expect(fn(10.5)).toBeTruthy();
    expect(fn(10)).toBeFalsy();
})

it('should compile and run "ends" operator',()=>{
    let fn = compileFunction("...2");
    expect(fn(0.2)).toBeTruthy();
    expect(fn(2)).toBeTruthy();
    expect(fn(22)).toBeTruthy();
    expect(fn(142)).toBeTruthy();
    expect(fn(21)).toBeFalsy();
    expect(fn(120)).toBeFalsy();
    expect(fn(4)).toBeFalsy();
    expect(fn(20)).toBeFalsy();
});

