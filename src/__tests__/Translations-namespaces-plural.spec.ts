import { Dictionary, Translations } from "..";

let translations: Translations;

beforeEach(() => {
  let dictionary: Dictionary = {
    item: {
      test: {
        value: "test: ${value}",
        plural: {
          value: [
            ["= 0", "none"],
            ["= 1", "one test"],
            ["= 100", "$&{onehundred} tests"],
            ["= 200", "$&{item:twohundred} tests"],
            ["_", "$# tests"],
          ],
        },
      },
      "twohundred":"Two Hundred"
    },
    "onehundred":{
      value: "One Hundred",
    }
  };
  translations = new Translations(
    { "en-US": dictionary },
    { cacheDynamic: false, defaultLang: "en-US" }
  );
});

test("Use value from namespace", () => {
  const translated = translations.translate("item:test", {
    value: 105,
  });
  expect(translated).toBe("test: 105 tests");
});

test("Use value from namespace", () => {
  debugger
  const translated = translations.translate("item:test", {
    value: 100,
  });
  expect(translated).toBe("test: One Hundred tests");
});

test("Translate valuefrom namespace", () => {
  const translated = translations.translate("item:test", {
    value: 200,
  });
  expect(translated).toBe("test: Two Hundred tests");
});
