import { Translations } from "..";
import { Dictionary } from "../Translations";

test("Fallback Property in Dictionary", () => {
  const dics = {
    "en-US": {
      "hello_${user}": "Hello ${user?User}!",
    },
  };
  const translations = new Translations(dics);
  const translated = translations.translateTo("en-US", "hello_${user}", {
    user: undefined!,
  });
  expect(translated).toBe("Hello User!");
});

test("Fallback Property in Fallback :) Value", () => {
  const translations = new Translations({});
  const translated = translations.translateTo(
    "en-US",
    "hello_{user}",
    { user: undefined! },
    "Hello ${user?Friend}!"
  );
  expect(translated).toBe("Hello Friend!");
});

test("Fallback with dictionary", () => {
  const dics = {
    "en-US": {
      "hello_${user}": "Hello ${user?User}!",
      "goodbye_${user}": "Goodbye ${user?User}!",
    },
    "ru-RU": {
      "hello_${user}": "Привет, $T{user?User}!",
      User: "Пользовтель",
      Oleg: "Олег",
    },
  };
  const translations = new Translations(dics, {
    defaultLang: "ru-RU",
    fallbackLang: "en-US",
  });

  expect(translations.translate("hello_${user}", { user: "Oleg" })).toBe(
    "Привет, Олег!"
  );
  expect(
    translations.translate(
      "goodbye_${user}",
      { user: "Oleg" },
      "Bye ${user?User}"
    )
  ).toBe("Goodbye Oleg!");
  expect(
    translations.translate(
      "hello_${user}",
      { },
    )
  ).toBe("Привет, Пользовтель!");
  expect(
    translations.translate(
      "nice_day_${user}",
      { user: undefined! },
      "Have a nice day ${user?Friend}"
    )
  ).toBe("Have a nice day Friend");
});
