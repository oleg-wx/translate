import { Translations } from "..";

let operations = [
  "<=",
  "0",
  ">",
  "==",
  "[1,2,3]",
  "+",
  "doit()",
  "between",
  "between a and b",
  "between 3-4",
  "between 1 4",
  "> a"
];
operations.forEach((v, i) => {
  test(`throw ${v}`, () => {
    let translations = new Translations({
      en: {
        "i-ate-${bananas}": {
          value: "I ate ${bananas}",
          plural: {
            bananas: [
              [v, "few bananas"],
            ],
          },
          description: "translations",
        },
      },
    });

    expect(()=>translations.translateTo("en", "i-ate-${bananas}", { bananas: 1 })).toThrowError(new Error(`operator "${v}" not supported`));
  });
});

operations = [
  "in []",
  "in [1,2,3",
  "in 4]",
];
operations.forEach((v, i) => {
  test(`throw wrong array format ${v}`, () => {
    let translations = new Translations({
      en: {
        "i-ate-${bananas}": {
          value: "I ate ${bananas}",
          plural: {
            bananas: [
              [v, "few bananas"],
            ],
          },
          description: "translations",
        },
      },
    });

    expect(()=>translations.translateTo("en", "i-ate-${bananas}", { bananas: 1 })).toThrowError(new Error(`wrong array format: "${v}"`));
  });
});
