import { Translations } from "..";
import { Dictionary } from "../Translations";

test("Fallback Property in Dictionary", () => {
  const dics = {
    "en-US": {
      "hello_{user}": "Hello {user?User}!",
    },
  };
  const translations = new Translations(dics);
  const translated = translations.translate("en-US", "hello_{user}", {
    user: undefined!,
  });
  expect(translated).toBe('Hello User!')
});

test("Fallback Property in Fallback :) Value", () => {
  const translations = new Translations({});
  const translated = translations.translate(
    "en-US",
    "hello_{user}",
    { user: undefined! },
    "Hello {user?Friend}!"
  );
  expect(translated).toBe('Hello Friend!')
});
