import { SimplePipeline } from './core/middleware/simple-pipeline';
import {
    Dictionaries,
    Dictionary,
    DictionaryEntry,
    TranslateDynamicProps,
    TranslateKey,
    Pipeline,
    MiddlewareFunc,
    MiddlewareStatic,
    PlaceholderType,
} from './core/types';
import { TranslateOptions } from './translate';
import { Translations } from './Translations';

export default function () {
    return new Translations();
}

export {
    Translations,
    Dictionaries,
    Dictionary,
    DictionaryEntry,
    TranslateOptions,
    TranslateDynamicProps,
    TranslateKey,
    Pipeline,
    SimplePipeline,
    MiddlewareFunc,
    MiddlewareStatic,
    PlaceholderType,
};
