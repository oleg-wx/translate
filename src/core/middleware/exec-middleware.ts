import { Context, MiddlewareStatic, MiddlewareFunc } from '../types';


export const execMiddleware = (
    middleware: MiddlewareStatic | MiddlewareFunc,
    context: Context
) => {
    if (typeof middleware === 'function') {
        middleware(context);
    } else {
        middleware.exec(context);
    }
};
