import { Dictionary, DictionaryEntry } from "./core/types";
import { TranslateSettings } from "./translate";
import { Translations } from "./Translations";

export default function () {
  return new Translations();
}

export { Translations, Dictionary, DictionaryEntry, TranslateSettings as TranslateOptions };
