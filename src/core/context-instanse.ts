import { TranslateKeyInstance } from './translation-key';
import {
    TranslateDynamicProps,
    Pipeline,
} from './types';
import { SimpleDefaultPipeline } from './middleware/simple-pipeline';
import { Context, ContextParams, ContextBaseResult } from './types';

export class ContextInstance<T = {}> implements Context<T> {
    public result: ContextBaseResult & T;

    constructor(
        public params: ContextParams,
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
        return this.pipeline.run(params);
    }
}
