import { Dictionary, DictionaryEntry } from "./Translations";


export function getTranslationValue(
  dictionary: Dictionary | undefined,
  key: string
): string | DictionaryEntry | undefined {
  if (!key) {
    return undefined!;
  }
  if (!dictionary) {
    return undefined!;
  }
  var term = dictionary[key];
  return term;
}
