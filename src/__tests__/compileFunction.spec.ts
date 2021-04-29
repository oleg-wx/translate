import { compileFunction } from "../compileFunction"

test("compile in",()=>{
    var fn = compileFunction("in [1,2,3]");
    expect(fn(1)).toBeTruthy();
    expect(fn(2)).toBeTruthy();
    expect(fn(3)).toBeTruthy();
    expect(fn(4)).toBeFalsy();
    expect(fn(0)).toBeFalsy();
});

test("compile between",()=>{
    var fn = compileFunction("between 1 and 3");
    expect(fn(1)).toBeTruthy();
    expect(fn(2)).toBeTruthy();
    expect(fn(3)).toBeTruthy();
    expect(fn(4)).toBeFalsy();
    expect(fn(0)).toBeFalsy();
});

test("compile <",()=>{
    var fn = compileFunction("< 1");
    expect(fn(0)).toBeTruthy();
    expect(fn(1)).toBeFalsy();

    var fn = compileFunction("< 10");
    expect(fn(9)).toBeTruthy();
    expect(fn(11)).toBeFalsy();

    var fn = compileFunction("< -1");
    expect(fn(-2)).toBeTruthy();
    expect(fn(0)).toBeFalsy();
})

test("compile >",()=>{
    var fn = compileFunction("> 1");
    expect(fn(2)).toBeTruthy();
    expect(fn(1)).toBeFalsy();

    var fn = compileFunction("> 10");
    expect(fn(11)).toBeTruthy();
    expect(fn(9)).toBeFalsy();

    var fn = compileFunction("> -1");
    expect(fn(0)).toBeTruthy();
    expect(fn(-2)).toBeFalsy();
})

test("compile >=",()=>{
    var fn = compileFunction(">= 1");
    expect(fn(2)).toBeTruthy();
    expect(fn(1)).toBeTruthy();
    expect(fn(0)).toBeFalsy();

    var fn = compileFunction(">= 10");
    expect(fn(11)).toBeTruthy();
    expect(fn(10)).toBeTruthy();
    expect(fn(9)).toBeFalsy();
})

test("compile <=",()=>{
    var fn = compileFunction("<= 1");
    expect(fn(0)).toBeTruthy();
    expect(fn(1)).toBeTruthy();
    expect(fn(2)).toBeFalsy();

    var fn = compileFunction("<= 10");
    expect(fn(9)).toBeTruthy();
    expect(fn(10)).toBeTruthy();
    expect(fn(11)).toBeFalsy();
})

