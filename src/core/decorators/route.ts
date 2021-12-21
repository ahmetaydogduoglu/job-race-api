import Reflect from '@core/reflect';

export function Route(route: string): Function {
    return function (target: any) {
        const meta = Reflect.getMetaData(target);

        let config = { target, routes: [], route }
        
        if (meta) {
            config = { ...meta, route };
        } 

        Reflect.defineMetaData(target, config);
    };
}
