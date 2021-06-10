import { Translations } from "..";
import { Dictionary } from "../Translations";

test("Fallback Property in Dictionary", () => {
  const dics = {
    "en-US": {
      user: {
        "hello_${user}": "Hello ${user?User}!",
      },
    },
  };
  const translations = new Translations(dics);
  const translated = translations.translateTo("en-US", ["user","hello_${user}"], {
    user: undefined!,
  });
  expect(translated).toBe("Hello User!");
});

test("Fallback Property in Dictionary", () => {
  const dics = {
    "en-US": {
      user: {
        "hello_${user}": "Hello ${user?User}!",
      },
    },
  };
  const translations = new Translations(dics);
  translations.defaultLang = "en-US";
  const translated = translations.translateTo("en-US", "user:hello_${user}", {
    user: undefined!,
  });
  expect(translated).toBe("Hello User!");
});
