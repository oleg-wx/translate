import { Dictionary, DictionaryEntry } from "./Translations";

export function getTranslationValue(
  dictionary: Dictionary | undefined,
  key: string | string[]
): string | DictionaryEntry | undefined {
  if (!key) {
    return undefined!;
  }
  if (!dictionary) {
    return undefined!;
  }
  if (Array.isArray(key)) {
    var _term = dictionary as any;
    for (var i = 0; i < key.length; i++) {
      _term = _term[key[i]];
    }
    return _term;
  }
  var term = dictionary[key];
  return term as string | DictionaryEntry | undefined;
}
