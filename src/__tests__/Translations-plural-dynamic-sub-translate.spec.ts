import { Translations } from "..";

let translations = new Translations(
  {
    en: {
      "i-ate-{apples}-{when}": {
        value: "I ate ${apples} for $T{when}",
        plural: {
          apples: [
            ["= 1", "One apple"],
            ["= 4", "$T{$-only} apple"],
            ["in [2,3]", "$T{$} apples"],
            ["_", "$T{$} apple(s)"],
          ],
        },
      },
      dinner: "Dinner",
      breakfast: "Breakfast",
      "4-only":"Only Four",
      "1":"One",
      "2":"Two",
      "3":"Three",
      "just":"Just"
    },
  },
  { cacheDynamic: true }
);

let values = [
  {
    apples: 1,
    when: "dinner",
  },
  {
    apples: 2,
    when: "breakfast",
  },
  {
    apples: 3,
    when: "dinner",
  },
  {
    apples: 4,
    when: "breakfast",
  },
  {
    apples: 5,
    when: "dinner",
  },
];

let expectedEn = [
  "I ate One apple for Dinner",
  "I ate Two apples for Breakfast",
  "I ate Three apples for Dinner",
  "I ate Only Four apple for Breakfast",
  "I ate 5 apple(s) for Dinner",
];

values.forEach((v, i) => {
  test("translate sub " + expectedEn[i], () => {
    expect(translations.translateTo("en", "i-ate-{apples}-{when}", v)).toBe(
      expectedEn[i]
    );
  });
});
