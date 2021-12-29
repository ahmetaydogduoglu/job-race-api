import express, { Router } from 'express';
import Reflect from '@core/reflect';

class ExpressRegisterProccess {
    constructor() {

    }

    public app = express();

    public registerRoute(baseUrl: string, router: Router): void {
        this.app.use(baseUrl, router);
    }

    public startServer({ controllers, initialMiddlewares, endOfMiddlewares }: { controllers: Array<any>, initialMiddlewares: Array<any>, endOfMiddlewares: Array<any> }): void {
        this.registerMiddlewares(initialMiddlewares);
        this.registerRoutes(controllers);
        this.registerMiddlewares(endOfMiddlewares);

        this.app.listen('8080', () => {
            console.log('listining 8080 ports');
        });
    }

    private registerRoutes(controllers: Array<any>): void {
        controllers.forEach(controller => {
            const classInstance = new controller();
            const meta = Reflect.getMetaData(controller);

            if (meta) {
                meta.routes?.forEach?.((route: any) => {
                    // @ts-ignore
                    this.app[route.method](meta.route + route.url, (req: any, res: any, next: any) => {
                        if (route.authMiddleware) {
                            route.authMiddleware(req, res, next);
                        } else {
                            next();
                        }
                    }, (req: any, res: any, next: any) => {
                        if (route.methodName) {
                            // @ts-ignore
                            classInstance[route.methodName](req, res, next);
                        }
                    });
                });
            }
        });
    }

    private registerMiddlewares(middleWares: Array<any>): void {
        middleWares.forEach(item => { this.app.use(item); });
    }
}

export const expressRegisterProccess = new ExpressRegisterProccess;
