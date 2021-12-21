import Reflect from '@core/reflect';
import Methods from '../enum/methods';

function methodDecoratorsFactory(url: string, method: string, authMiddleware?: (req: any, res: any, next: any) => void) {
    return (target: any, propertyKey: string) => {
        const meta = Reflect.getMetaData(target.constructor);
        const config = {
            method,
            url,
            methodName: propertyKey,
            authMiddleware
        }

        if (meta) {
            Reflect.defineMetaData(target.constructor, { ...meta, routes: [...meta.routes, config] });
        } else {
            Reflect.defineMetaData(target.constructor, { target, routes: [config] });
        }
    };
}

export function Get(url: string, authMiddleware?: (req: any, res: any, next: any) => void) { return methodDecoratorsFactory(url, Methods.Get, authMiddleware); }

export function Post(url: string, authMiddleware?: (req: any, res: any, next: any) => void) { return methodDecoratorsFactory(url, Methods.Post, authMiddleware); }

export function Put(url: string, authMiddleware?: (req: any, res: any, next: any) => void) { return methodDecoratorsFactory(url, Methods.Put, authMiddleware); }

export function Delete(url: string, authMiddleware?: (req: any, res: any, next: any) => void) { return methodDecoratorsFactory(url, Methods.Delete, authMiddleware); }