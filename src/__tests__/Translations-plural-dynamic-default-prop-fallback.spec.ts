import { Translations } from "..";

let translations = new Translations(
  {
    en: {},
  },
  { cacheDynamic: true }
);

let values:{bananas?:number,when?:string}[] = [
  {
    when: "breakfast",
  },
  {
    bananas: 3,
  },
  {
    bananas: 3,
    when: undefined,
  },
];

let expectedDef = [
  "I ate bananas banana(s) for breakfast",
  "I ate 3 banana(s) for when",
  "I ate 3 banana(s) for when",
];
values.forEach((v, i) => {
  test("translate with default prop fallback" + expectedDef[i], () => {
    expect(
      translations.translateTo(
        "en",
        "i-ate-bananas-when-fallback",
        v,
        "I ate ${bananas} banana(s) for $&{when}"
      )
    ).toBe(expectedDef[i]);
  });
});

let expectedFallback = [
  "I ate some amount of banana(s) for breakfast",
  "I ate 3 banana(s) for launch",
  "I ate 3 banana(s) for launch",
];
values.forEach((v, i) => {
  test("translate with default custom prop fallback" + expectedFallback[i], () => {
    expect(
      translations.translateTo(
        "en",
        "i-ate-bananas-when-fallback-dynamic",
        v,
        "I ate ${bananas?some amount of} banana(s) for $&{when?launch}"
      )
    ).toBe(expectedFallback[i]);
  });
});
