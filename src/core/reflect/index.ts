/**
 * @class Reflect
 */
class Reflect<T> {
    private _metas: Map<any, any> = new Map();

    public get metas(): Map<any, any> { return this._metas; }

    public defineMetaData(key: any, data: T): void {
        this._metas.set(key, data);
    }

    public getMetaData(key: any): any | undefined {
        return this._metas.get(key);
    }
}

export default new Reflect;

