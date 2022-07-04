import { execMiddleware } from './exec-middleware';
import { Context, FallbackLangParams, MiddlewareStatic, MiddlewareFunc, FallbackLangResult } from '../types';
import { GetEntryMiddleware } from './get-entry-middleware';

export class FallbackWithDifferentLanguageStaticMiddleware
    implements MiddlewareStatic<FallbackLangResult, FallbackLangParams>
{
    constructor(protected getEntryMiddleware: MiddlewareStatic | MiddlewareFunc) {}

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
            execMiddleware(this.getEntryMiddleware, tempContext);
            context.result.value = tempContext.result.value;
            if (context.result.value) {
                context.result.fallingBack = true;
                context.result.fallingBackLang = context.params.data?.fallbackLang;
            }
        }
    }
}

export const FallbackWithDifferentLanguageMiddleware: MiddlewareFunc<FallbackLangResult, FallbackLangParams> = (
    context
) => {
    const { params, result } = context;

    if (!result.value && params.data?.fallbackLang) {
        if (params.data?.fallbackLang === params.lang) {
            return;
        }
        const tempContext: Context = {
            ...context,
            params: {
                ...params,
                lang: params.data.fallbackLang,
            },
        };
        execMiddleware(GetEntryMiddleware, tempContext);
        context.result.value = tempContext.result.value;
        if (context.result.value) {
            context.result.fallingBack = true;
            context.result.fallingBackLang = context.params.data?.fallbackLang;
        }
    }
};
