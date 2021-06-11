import { Translations } from "..";
import { Dictionary } from "../Translations";

let translations: Translations

beforeEach(()=>{
  const dics = {
    "en-US": {
      user: {
        "hello_${user}": "Hello ${user?User}!",
      },
    },
  };
  translations = new Translations(dics);
})


test("Translate with namespace", () => {
  translations.defaultLang = "en-US";
  const translated = translations.translate(["user","hello_${user}"], {
    user: undefined!,
  });
  expect(translated).toBe("Hello User!");
});

test("TranslateTo with namespace", () => {
  const translated = translations.translateTo("en-US", "user:hello_${user}", {
    user: undefined!,
  });
  expect(translated).toBe("Hello User!");
});
