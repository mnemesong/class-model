export type PropertyValidator = (propName: string, propLabel: string, model: any) => string[];
/**
 * Strict not deep equals to scalar val
 */
export declare function strictEquals(val: string | bigint | number | boolean | null | undefined | symbol, printActualVal?: boolean): PropertyValidator;
/**
 * Deep strict equals validator
 */
export declare function strictDeepEquals(val: any, printActualVal?: boolean, serialize?: ((v: any) => string) | null): PropertyValidator;
