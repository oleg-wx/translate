import { Translations } from "..";

let key = "i-ate-{eggs}-{bananas}-dinner";
let translations = new Translations(
  {
    'en': {
      [key]: {
        value: "I ate {bananas} and {eggs} for dinner",
        plural: {
          bananas: [
            ["= 0", "no bananas"],
            ["= 1", "one banana"],
            ["in [3,4]", "{$} bananas"],
            ["> 10", "too many bananas"],
            ["> 5", "many bananas"],
            ["_", "{$} bananas"],
          ],
          eggs: [
            ["= 0", "zero eggs"],
            ["= 1", "one egg"],
            ["_", "{$} eggs"],
          ],
        },
        description: "translations",
      },
    },
    'ru': {
      [key]: {
        value: "Я съел {bananas} и {eggs} на обед",
        plural: {
          bananas: [
            ["= 0", "нуль бананов"],
            ["= 1", "один банан"],
            ["= 2", "два банана"],
            ["in [3,4]", "{$} банана"],
            ["> 10", "слишком много бананов"],
            ["> 5", "много бананов"],
            ["_", "{$} бананов"],
          ],
          eggs: [
            ["= 0", "нуль яиц"],
            ["= 1", "одно яйцо"],
            ["= 2", "два яйца"],
            ["in [3,4]", "{$} яйца"],
            ["_", "{$} яйц"],
          ],
        },
        description: "translations",
      },
    },
  },
  {cacheDynamic: true}
);

let values = [
  {
    bananas: 0,
    eggs: 3,
  },
  {
    bananas: 3,
    eggs: 4,
  },
  {
    bananas: 1,
    eggs: 2,
  },
  {
    bananas: 11,
    eggs: 0,
  },
  {
    bananas: 6,
    eggs: 1,
  },
];

beforeEach(() => {});

let expectedEn = [
  "I ate no bananas and 3 eggs for dinner",
  "I ate 3 bananas and 4 eggs for dinner",
  "I ate one banana and 2 eggs for dinner",
  "I ate too many bananas and zero eggs for dinner",
  "I ate many bananas and one egg for dinner",
];

values.forEach((v, i) => {
  test("translate plural " + expectedEn[i], () => {
    expect(translations.translate('en', key, v)).toBe(expectedEn[i]);
  });
});

let expectedRu = [
  "Я съел нуль бананов и 3 яйца на обед",
  "Я съел 3 банана и 4 яйца на обед",
  "Я съел один банан и два яйца на обед",
  "Я съел слишком много бананов и нуль яиц на обед",
  "Я съел много бананов и одно яйцо на обед",
];

values.forEach((v, i) => {
  test("translate plural " + expectedRu[i], () => {
    expect(translations.translate('ru', key, v)).toBe(expectedRu[i]);
  });
});

test("cached", () => {
  expect(Object.keys(translations.dynamicCache['en']).length).toBe(5);
});
