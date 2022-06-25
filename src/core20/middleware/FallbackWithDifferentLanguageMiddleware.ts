import { execMiddleware } from './execMiddleware';
import {
    Context,
    FallbackLangParams,
    Middleware,
    MiddlewareFunc,
} from '../types';

export class FallbackWithDifferentLanguageMiddleware
    implements Middleware<{}, FallbackLangParams>
{
    constructor(protected fallbackMiddleware: Middleware | MiddlewareFunc) {}

    exec(context: Context<{}, FallbackLangParams>, next: () => void): void {
        if (!context.result.value && context.params.data?.fallbackLang) {
            const tempContext = {
                ...context,
                params: {
                    ...context.params,
                    lang: context.params.data?.fallbackLang,
                },
            };
            execMiddleware(this.fallbackMiddleware, tempContext, () => {
                context.result.value = tempContext.result.value;
                next();
            });
            return;
        }
        next();
    }
}
