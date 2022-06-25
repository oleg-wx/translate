import { TranslateKeyInstance } from '../translationKey';
import {
    Middlewares,
    Pipeline,
    TranslateDynamicProps,
    TranslateInternalSettings,
    TranslateKey,
} from '../types';
import { AddToDynamicCacheMiddleware } from './addToDynamicCache';
import { ContextInstance } from '../contextInstanse';
import { execMiddleware } from './execMiddleware';
import { FallbackMiddleware } from './fallbackMiddleware';
import { FallbackWithDifferentLanguageMiddleware } from './FallbackWithDifferentLanguageMiddleware';
import { FillPlaceholdersMiddleware } from './fillPlaceholders';
import { GetEntryMiddleware } from './getEntryMiddleware';
import { GetFromDynamicCacheMiddleware } from './getFromDynamicCache';
import { Context, ContextParams, Middleware, MiddlewareFunc } from '../types';

export class SimplePipeline implements Pipeline {
    readonly middlewares: Middlewares = [];

    constructor() {
        this.middlewares.push(...[
            GetEntryMiddleware,
            FallbackMiddleware,
            GetFromDynamicCacheMiddleware,
            FillPlaceholdersMiddleware,
            AddToDynamicCacheMiddleware,
        ]);
    }

    run(params: ContextParams, settings: TranslateInternalSettings): string {
        return runPipeline(params, settings, this, this.middlewares);
    }
}

export class SimpleDefaultPipeline implements Pipeline {
    private _middlewares: Array<
        MiddlewareFunc<any, any> | Middleware<any, any>
    >;

    constructor() {
        this._middlewares = [
            GetEntryMiddleware,
            new FallbackWithDifferentLanguageMiddleware(GetEntryMiddleware),
            FallbackMiddleware,
            GetFromDynamicCacheMiddleware,
            FillPlaceholdersMiddleware,
            AddToDynamicCacheMiddleware,
        ];
    }

    run(params: ContextParams, settings: TranslateInternalSettings): string {
        return runPipeline(params, settings, this, this._middlewares);
    }
}

export function runPipeline(
    params: ContextParams,
    settings: TranslateInternalSettings,
    currentPipeline: Pipeline,
    middlewares: Middlewares
): string {
    const context: Context = new ContextInstance(
        params,
        settings,
        currentPipeline
    );

    let currentIndex = -1;
    const next = () => {
        currentIndex++;
        const middleware = middlewares[currentIndex];
        if (middleware) {
            execMiddleware(middleware, context, next);
        }
    };
    next();

    return context.result.value ?? '';
}
