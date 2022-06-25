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
import {
    Context,
    ContextParams,
    MiddlewareStatic,
    MiddlewareFunc,
} from '../types';

export class SimplePipeline implements Pipeline {
    private _middlewares: Middlewares = [];
    get middlewares() {
        return this._middlewares;
    }

    constructor() {
        this.middlewares.push(
            GetEntryMiddleware,
            FallbackMiddleware,
            GetFromDynamicCacheMiddleware,
            FillPlaceholdersMiddleware,
            AddToDynamicCacheMiddleware
        );
    }

    run(params: ContextParams, settings: TranslateInternalSettings): string {
        return runPipeline(params, settings, this, this.middlewares);
    }

    /** adds middleware in the end of pipeline queue */
    addMiddleware(middleware: MiddlewareStatic | MiddlewareFunc) {
        this.middlewares.push(middleware);
    }

    /** adds middleware at the specific index */
    addMiddlewareAt(
        index: number,
        middleware: MiddlewareStatic | MiddlewareFunc
    ) {
        if (index < 0 || index >= this._middlewares.length) return;
        this.middlewares.splice(index, 0, middleware);
    }

    /** removes middleware at the specific index */
    removeMiddlewareAt(index: number) {
        if (index < 0 || index >= this._middlewares.length) return;
        this.middlewares.splice(index, 1);
    }
}

export class SimpleDefaultPipeline implements Pipeline {
    private _middlewares: Array<
        MiddlewareFunc<any, any> | MiddlewareStatic<any, any>
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
