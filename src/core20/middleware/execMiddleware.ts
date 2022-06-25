import { Context, Middleware, MiddlewareFunc } from '../types';


export const execMiddleware = (
    middleware: Middleware | MiddlewareFunc,
    context: Context,
    next: () => void
) => {
    if (typeof middleware === 'function') {
        middleware(context, next);
    } else {
        middleware.exec(context, next);
    }
};
