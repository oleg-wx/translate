import { Context, MiddlewareStatic, MiddlewareFunc } from '../types';


export const execMiddleware = (
    middleware: MiddlewareStatic | MiddlewareFunc,
    context: Context,
    next: () => void
) => {
    if (typeof middleware === 'function') {
        middleware(context, next);
    } else {
        middleware.exec(context, next);
    }
};
