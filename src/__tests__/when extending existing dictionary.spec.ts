import { Dictionary, Translations } from "..";


describe('when extending existing dictionary',()=>{
let translations: Translations;

beforeEach(() => {
  let dictionary: Dictionary = {
    test: {
      value: "test: ${value}",
      plural: {
        value: [
          ["= 0", "none"],
          ["= 1", "one test"],
          ["_", "$# tests"],
        ],
      },
    },
  };
  translations = new Translations(
    { "en-US": dictionary },
    { cacheDynamic: false, lang: "en-US" }
  );
});

it("should add new entry", () => {
  expect(translations.translate("test_test_${value}", { value: 1 })).toBe(
    "test_test_1"
  );
  translations.extendDictionary("en-US", {
    "test_test_${value}": "test it: ${value}",
  });
  expect(translations.translate("test_test_${value}", { value: 1 })).toBe(
    "test it: 1"
  );
});

test("should replace an entry", () => {
  expect(translations.translate("test", { value: 1 })).toBe("test: one test");
  translations.extendDictionary("en-US", { test: "test it: ${value}" });
  expect(translations.translate("test", { value: 1 })).toBe("test it: 1");
});
});