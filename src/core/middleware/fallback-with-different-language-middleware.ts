import { execMiddleware } from './exec-middleware';
import {
    Context,
    FallbackLangParams,
    MiddlewareStatic,
    MiddlewareFunc,
    FallbackLangResult,
} from '../types';

export class FallbackWithDifferentLanguageMiddleware
    implements MiddlewareStatic<FallbackLangResult, FallbackLangParams>
{
    constructor(
        protected fallbackMiddleware: MiddlewareStatic | MiddlewareFunc
    ) {}

    exec(context: Context<FallbackLangResult, FallbackLangParams>): void {
        if (!context.result.value && context.params.data?.fallbackLang) {
            if (context.params.data?.fallbackLang === context.params.lang) {
                return;
            }
            const tempContext = {
                ...context,
                params: {
                    ...context.params,
                    lang: context.params.data?.fallbackLang,
                },
            };
            execMiddleware(this.fallbackMiddleware, tempContext);
            context.result.value = tempContext.result.value;
            if (context.result.value) {
                context.result.fallingBack = true;
                context.result.fallingBackLang =
                    context.params.data?.fallbackLang;
            }
        }
    }
}
