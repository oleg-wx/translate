import { Translations } from "..";

let key = "i-ate-${bananas}-${when}";
let translations = new Translations(
  {
    en: {
      [key]: {
        value: "I ate ${bananas} banana(s) for $&{when}",
      },
      dinner: "Dinner",
      breakfast: "Breakfast",
    },
    ru: {
      [key]: {
        value: "Я съел ${bananas} банан(а/ов) на $&{when}",
      },
      dinner: "ужин",
      breakfast: "завтрак",
    },
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
  "I ate 0 banana(s) for Dinner",
  "I ate 3 banana(s) for Breakfast",
];
values.forEach((v, i) => {
  test("translate plural " + expectedEn[i], () => {
    expect(translations.translateTo("en", key, v)).toBe(expectedEn[i]);
  });
});

let expectedRu = [
  "Я съел 0 банан(а/ов) на ужин",
  "Я съел 3 банан(а/ов) на завтрак",
];
values.forEach((v, i) => {
  test("translate plural " + expectedRu[i], () => {
    expect(translations.translateTo("ru", key, v)).toBe(expectedRu[i]);
  });
});
