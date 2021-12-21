export class TypeControl {
    public static isUndefined(param: any): boolean {
        return typeof param === 'undefined';
    }

    public static isNumber(param: any): boolean {
        return typeof param === 'number';
    }
}