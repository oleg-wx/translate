import { Middlewares, Pipeline } from '../types';
import { ContextInstance } from '../context-instanse';
import { execMiddleware } from './exec-middleware';
import { FallbackMiddleware } from './fallback-middleware';
import { FallbackWithDifferentLanguageMiddleware } from './fallback-with-different-language-middleware';
import { FillPlaceholdersMiddleware } from './fill-placeholders-middleware';
import { GetEntryMiddleware } from './get-entry-middleware';
import {
    Context,
    ContextParams,
    MiddlewareStatic,
    MiddlewareFunc,
} from '../types';
import { PrepareRegularExpressionsMiddleware } from './prepare-regular-expressions-middleware';

export abstract class SimplePipelineBase implements Pipeline {
    protected _middlewares: Middlewares = [];
    get middlewares() {
        return this._middlewares;
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

export class SimplePipeline extends SimplePipelineBase {
    constructor() {
        super();
        this._middlewares = [
            PrepareRegularExpressionsMiddleware,
            GetEntryMiddleware,
            FallbackMiddleware,
            FillPlaceholdersMiddleware,
        ];
    }
}

export class SimpleDefaultPipeline extends SimplePipelineBase {
    constructor() {
        super();
        this._middlewares = [
            PrepareRegularExpressionsMiddleware,
            GetEntryMiddleware,
            new FallbackWithDifferentLanguageMiddleware(GetEntryMiddleware),
            FallbackMiddleware,
            FillPlaceholdersMiddleware,
        ];
    }
}

export function runPipeline(
    params: ContextParams,
    currentPipeline: Pipeline,
    middlewares: Middlewares
): string {
    const context: Context = new ContextInstance(params, currentPipeline);

    for (let i = 0; i < middlewares.length; i++) {
        const middleware = middlewares[i];
        execMiddleware(middleware, context);
    }

    return context.result.value ?? '';
}
