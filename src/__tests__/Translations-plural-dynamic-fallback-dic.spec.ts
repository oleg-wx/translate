import { Translations } from "..";

let translations = new Translations(
  {
    en: {
      hello_world: "Hello World!",
      goodbye_world: "Goodbye World!",
      hello_user: "Hello $&{user?user_def}",
      goodbye_user: "Goodbye $&{user?user_def}",
      user_def: "User",
    },
    ru: {
      hello_world: "Привет, мир!",
      goodbye_user: "Пока, $&{user?user_def}",
      user_def: "Пользователь",
      Basil: "Василий",
    },
  },
  { cacheDynamic: true, defaultLang: "ru", fallbackLang: "en" }
);

let values = [
  {
    key: "hello_world",
  },
  {
    key: "goodbye_world",
  },
  {
    key: "hello_user",
  },
  {
    key: "hello_user",
    value: { user: "Basil" },
  },
  {
    key: "goodbye_user",
  },
  {
    key: "goodbye_user",
    value: { user: "Basil" },
  },
  {
    key: "nice_day",
    fallback: "Nice Day",
  },
];

let expectedEn = [
  "Привет, мир!",
  "Goodbye World!",
  "Hello User",
  "Hello Basil",
  "Пока, Пользователь",
  "Пока, Василий",
  "Nice Day",
];

values.forEach((v, i) => {
  test("translate with default language fallback" + expectedEn[i], () => {
    expect(translations.translate(v.key, v.value, v.fallback)).toBe(
      expectedEn[i]
    );
  });
});

test("cached", () => {
  expect(Object.keys(translations.dynamicCache["en"]).length).toBe(1);
  expect(Object.keys(translations.dynamicCache["ru"]).length).toBe(1);
});
