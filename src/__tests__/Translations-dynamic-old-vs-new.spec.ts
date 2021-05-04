import { Translations } from "..";

test("translate with old placeholder", () => {
  let translations = new Translations(
    {
      en: {
        "i-ate-bananas": {
          value: "I ate {bananas} banana(s)",
        },
      },
    },
    { cacheDynamic: true }
  );

  // SET no $
  translations.$less = true;

  expect(
    translations.translateTo("en","i-ate-bananas", {
      bananas: 3,
    })
  ).toBe("I ate 3 banana(s)");
});

test("translate with $ placeholder", () => {
  let translations = new Translations(
    {
      en: {
        "i-ate-bananas": {
          value: "I ate ${bananas} banana(s)",
        },
      },
    },
    { cacheDynamic: true }
  );
  translations.defaultLang = "en";

  expect(
    translations.translateTo("en","i-ate-bananas", {
      bananas: 3,
    })
  ).toBe("I ate 3 banana(s)");
});
