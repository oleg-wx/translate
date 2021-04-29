import { Translations } from "..";

let translations = new Translations(
  {
    en: {
      "i-ate-{apples}-{when}": {
        value: "I ate {apples} for $T{when}",
        plural: {
          apples: [
            ["= 1", "$T{$} apple"],
            ["in [2,3]", "$T{$} apples"],
            ["_", "$T{$} apple(s)"],
          ],
        },
      },
      dinner: "Dinner",
      breakfast: "Breakfast",
      "1":"One",
      "2":"Two",
      "3":"Three",
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
];

let expectedEn = [
  "I ate One apple for Dinner",
  "I ate Two apples for Breakfast",
  "I ate Three apples for Dinner",
  "I ate 4 apple(s) for Breakfast",
];

values.forEach((v, i) => {
  test("translate sub " + expectedEn[i], () => {
    expect(translations.translate("en", "i-ate-{apples}-{when}", v)).toBe(
      expectedEn[i]
    );
  });
});
