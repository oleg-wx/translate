import { TranslateKeyInstance } from './translationKey';
import {
    TranslateInternalSettings,
    TranslateDynamicProps,
    Pipeline,
} from './types';
import { SimpleDefaultPipeline } from './middleware/simplePipeline';
import { Context, ContextParams, ContextBaseResult } from './types';

export class ContextInstance<T = {}> implements Context<T> {
    public result: ContextBaseResult & T;

    constructor(
        public params: ContextParams,
        public settings: TranslateInternalSettings,
        public pipeline: Pipeline
    ) {
        this.result = {} as any;
    }

    public translate(
        key: string,
        dynamicProps?: TranslateDynamicProps,
        fallback?: string,
        lang?: string
    ) {
        const params: ContextParams = {
            lang: lang ?? this.params.lang,
            key: new TranslateKeyInstance(key),
            dictionaries: this.params.dictionaries,
            fallback,
            dynamicProps,
        };
        return this.pipeline.run(params, this.settings);
    }
}
