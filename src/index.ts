import { Dictionary, DictionaryEntry } from "./core/types";
import { TranslateOptions } from "./translate";
import { Translations } from "./Translations";

export default function () {
  return new Translations();
}

export { Translations, Dictionary, DictionaryEntry, TranslateOptions };
