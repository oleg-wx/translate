import { compileFunction } from "./compileFunction"

it('should compile and run "=" operator',()=>{
    var fn = compileFunction("=2");
    expect(fn(2)).toBeTruthy();
    expect(fn(1)).toBeFalsy();
    expect(fn(0)).toBeFalsy();
    expect(fn(3)).toBeFalsy();
    expect(fn(4)).toBeFalsy();
    expect(fn(22)).toBeFalsy();
    expect(fn(2.2)).toBeFalsy();
    expect(fn(1.8)).toBeFalsy();

    var fn = compileFunction("=2.2");
    expect(fn(2.2)).toBeTruthy();
    expect(fn(2)).toBeFalsy();
    expect(fn(3)).toBeFalsy();

});
it('should compile and run "==" operator',()=>{
    var fn = compileFunction("==2");
    expect(fn(2)).toBeTruthy();
    expect(fn(1)).toBeFalsy();
    expect(fn(0)).toBeFalsy();
    expect(fn(3)).toBeFalsy();
    expect(fn(4)).toBeFalsy();
    expect(fn(22)).toBeFalsy();
    expect(fn(2.2)).toBeFalsy();
    expect(fn(1.8)).toBeFalsy();

    var fn = compileFunction("==2.2");
    expect(fn(2.2)).toBeTruthy();
    expect(fn(2)).toBeFalsy();
    expect(fn(3)).toBeFalsy();
});

it('should compile and run "in" operator',()=>{
    var fn = compileFunction("in [1,2,3]");
    expect(fn(1)).toBeTruthy();
    expect(fn(2)).toBeTruthy();
    expect(fn(3)).toBeTruthy();
    expect(fn(4)).toBeFalsy();
    expect(fn(0)).toBeFalsy();
    expect(fn(12)).toBeFalsy();
    expect(fn(1.2)).toBeFalsy();

    var fn = compileFunction("in [1.1, 2.2]");
    expect(fn(1.1)).toBeTruthy();
    expect(fn(2.2)).toBeTruthy();
    expect(fn(1)).toBeFalsy();
    expect(fn(2)).toBeFalsy();
});

it('should compile and run "between" operator',()=>{
    var fn = compileFunction("between 1 and 3");
    expect(fn(1)).toBeTruthy();
    expect(fn(2)).toBeTruthy();
    expect(fn(2.5)).toBeTruthy();
    expect(fn(3)).toBeTruthy();
    expect(fn(4)).toBeFalsy();
    expect(fn(0)).toBeFalsy();
    expect(fn(13)).toBeFalsy();
    expect(fn(3.1)).toBeFalsy();

    var fn = compileFunction("between 1.5 and 3.5");
    expect(fn(1.5)).toBeTruthy();
    expect(fn(2)).toBeTruthy();
    expect(fn(3.5)).toBeTruthy();
    expect(fn(1)).toBeFalsy();
    expect(fn(1.4)).toBeFalsy();
    expect(fn(3.6)).toBeFalsy();
    expect(fn(4)).toBeFalsy();

});

it('should compile and run "<" operator',()=>{
    var fn = compileFunction("< 1");
    expect(fn(-1)).toBeTruthy();
    expect(fn(0)).toBeTruthy();
    expect(fn(1)).toBeFalsy();
    expect(fn(11)).toBeFalsy();

    var fn = compileFunction("< 10");
    expect(fn(9)).toBeTruthy();
    expect(fn(10)).toBeFalsy();
    expect(fn(11)).toBeFalsy();

    var fn = compileFunction("< 180");
    expect(fn(90)).toBeTruthy();
    expect(fn(179)).toBeTruthy();
    expect(fn(180)).toBeFalsy();
    expect(fn(181)).toBeFalsy();

    var fn = compileFunction("< -1");
    expect(fn(-2)).toBeTruthy();
    expect(fn(0)).toBeFalsy();
    expect(fn(-1)).toBeFalsy();

    var fn = compileFunction("< 1.5");
    expect(fn(-1)).toBeTruthy();
    expect(fn(0)).toBeTruthy();
    expect(fn(1)).toBeTruthy();
    expect(fn(1.4)).toBeTruthy();
    expect(fn(1.5)).toBeFalsy();
    expect(fn(1.6)).toBeFalsy();
    expect(fn(2)).toBeFalsy();
})

it('should compile and run ">" operator',()=>{
    var fn = compileFunction("> 1");
    expect(fn(2)).toBeTruthy();
    expect(fn(1)).toBeFalsy();

    var fn = compileFunction("> 10");
    expect(fn(11)).toBeTruthy();
    expect(fn(9)).toBeFalsy();

    var fn = compileFunction("> 180");
    expect(fn(181)).toBeTruthy();
    expect(fn(90)).toBeFalsy();

    var fn = compileFunction("> -1");
    expect(fn(0)).toBeTruthy();
    expect(fn(-2)).toBeFalsy();

    var fn = compileFunction("> 1.5");
    expect(fn(-1)).toBeFalsy();
    expect(fn(0)).toBeFalsy();
    expect(fn(1)).toBeFalsy();
    expect(fn(1.4)).toBeFalsy();
    expect(fn(1.5)).toBeFalsy();
    expect(fn(1.6)).toBeTruthy();
    expect(fn(2)).toBeTruthy();
})

it('should compile and run ">=" operator',()=>{
    var fn = compileFunction(">= 1");
    expect(fn(2)).toBeTruthy();
    expect(fn(1)).toBeTruthy();
    expect(fn(1.1)).toBeTruthy();
    expect(fn(0)).toBeFalsy();
    expect(fn(0.9)).toBeFalsy();
    expect(fn(-1)).toBeFalsy();

    var fn = compileFunction(">= 10");
    expect(fn(11)).toBeTruthy();
    expect(fn(10)).toBeTruthy();
    expect(fn(9)).toBeFalsy();

    var fn = compileFunction(">= 1.5");
    expect(fn(1.5)).toBeTruthy();
    expect(fn(2)).toBeTruthy();
    expect(fn(1)).toBeFalsy();
    expect(fn(1.4)).toBeFalsy();
})

it('should compile and run "<=" operator',()=>{
    var fn = compileFunction("<= 1");
    expect(fn(-1)).toBeTruthy();
    expect(fn(0)).toBeTruthy();
    expect(fn(1)).toBeTruthy();
    expect(fn(0.9)).toBeTruthy();
    expect(fn(2)).toBeFalsy();
    expect(fn(1.1)).toBeFalsy();

    var fn = compileFunction("<= 10");
    expect(fn(9)).toBeTruthy();
    expect(fn(10)).toBeTruthy();
    expect(fn(11)).toBeFalsy();

    var fn = compileFunction("<= 1.5");
    expect(fn(1.5)).toBeTruthy();
    expect(fn(1)).toBeTruthy();
    expect(fn(2)).toBeFalsy();
    expect(fn(1.6)).toBeFalsy();
})

