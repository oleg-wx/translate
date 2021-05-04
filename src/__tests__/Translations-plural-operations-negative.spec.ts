import { Translations } from "..";

let key = "i-ate-${bananas}-dinner";
let translations = new Translations({
  en: {
    [key]: {
      value: "I ate ${bananas} for dinner",
      plural: {
        bananas: [
          ["<= 3", "few bananas"],
          [">= 3", "several bananas"],
          ["< 1", "no bananas"],
          ["> 5", "too many bananas"],
          ["= 1", "one bananas"],
          ["_", "some bananas"],
        ],
      },
      description: "translations",
    },
  },
});

let values = [
  { bananas: -1 },
  { bananas: 0 },
  { bananas: 1 },
  { bananas: 2 },
  { bananas: 3 },
  { bananas: 4 },
  { bananas: 5 },
  { bananas: 6 },
  { bananas: 7 },
];

beforeEach(() => {});
  test(`no crossing plural `, () => {
    var translated = values.map(v=>translations.translateTo("en", key, v));
    expect(translated).not.toContain('I ate no bananas for dinner');
    expect(translated).not.toContain('I ate too many bananas for dinner');
    expect(translated).not.toContain('I ate one banana for dinner');
    expect(translated).not.toContain('I ate some bananas for dinner');
  });
