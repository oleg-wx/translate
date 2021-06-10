import { Translations } from "..";

let translations = new Translations(
  {
    en: {},
  },
  { cacheDynamic: true }
);

let values = [
  {
    bananas: 0,
    when: "dinner",
  },
  {
    bananas: 3,
    when: "breakfast",
  },
];

let expectedEn = [
  "I ate 0 banana(s) for dinner",
  "I ate 3 banana(s) for breakfast",
];

values.forEach((v, i) => {
  test("translate with fallback" + expectedEn[i], () => {
    expect(
      translations.translateTo(
        "en",
        "i-ate-${bananas}-${when}",
        v,
        "I ate ${bananas} banana(s) for $&{when}"
      )
    ).toBe(expectedEn[i]);
  });
});

test("translate with no fallback", () => {
  expect(
    translations.translateTo("en", "i-ate-${bananas}-${when}", {
      bananas: 3,
      when: "breakfast",
    })
  ).toBe("i-ate-3-breakfast");
});
