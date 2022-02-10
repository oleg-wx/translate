import { Dictionaries, Dictionary, DictionaryEntry, TranslateDynamicProps, TranslateKey } from "./core/types";
import { TranslateOptions } from "./translate";
import { Translations } from "./Translations";

export default function () {
  return new Translations();
}

export { Translations, Dictionaries, Dictionary, DictionaryEntry, TranslateOptions, TranslateDynamicProps, TranslateKey };
