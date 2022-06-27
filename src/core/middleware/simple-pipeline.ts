import {
    Middlewares,
    Pipeline,
} from '../types';
import { AddDynamicToCacheMiddleware } from './add-dynamic-to-cache';
import { ContextInstance } from '../context-instanse';
import { execMiddleware } from './exec-middleware';
import { FallbackMiddleware } from './fallback-middleware';
import { FallbackWithDifferentLanguageMiddleware } from './fallback-with-different-language-middleware';
import { FillPlaceholdersMiddleware } from './fill-placeholders-middleware';
import { GetEntryMiddleware } from './get-entry-middleware';
import { GetDynamicFromCacheMiddleware } from './get-dynamic-from-cache-middleware';
import {
    Context,
    ContextParams,
    MiddlewareStatic,
    MiddlewareFunc,
} from '../types';
import { PrepareRegularExpressionsMiddleware } from './prepare-regular-expressions-middleware';

export class SimplePipeline implements Pipeline {
    private _middlewares: Middlewares = [];
    get middlewares() {
        return this._middlewares;
    }

    constructor() {
        this.middlewares.push(
            PrepareRegularExpressionsMiddleware,
            GetEntryMiddleware,
            FallbackMiddleware,
            GetDynamicFromCacheMiddleware,
            FillPlaceholdersMiddleware,
            AddDynamicToCacheMiddleware
        );
    }

    run(params: ContextParams): string {
        return runPipeline(params, this, this.middlewares);
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
            PrepareRegularExpressionsMiddleware,
            GetEntryMiddleware,
            new FallbackWithDifferentLanguageMiddleware(GetEntryMiddleware),
            FallbackMiddleware,
            GetDynamicFromCacheMiddleware,
            FillPlaceholdersMiddleware,
            AddDynamicToCacheMiddleware,
        ];
    }

    run(params: ContextParams): string {
        return runPipeline(params, this, this._middlewares);
    }
}

export function runPipeline(
    params: ContextParams,
    currentPipeline: Pipeline,
    middlewares: Middlewares
): string {
    const context: Context = new ContextInstance(
        params,
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
