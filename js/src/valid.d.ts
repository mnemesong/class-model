export type PropertyValidator = (propName: string, propLabel: string, propVal: any) => string[];
/**
 * Strict not deep equals to scalar val
 */
export declare function strictEqual(val: string | bigint | number | boolean | null | undefined | symbol, printActualVal?: boolean): PropertyValidator;
/**
 * Deep strict equals validator
 */
export declare function strictDeepEqual(val: any, printActualVal?: boolean, serialize?: ((v: any) => string) | null): PropertyValidator;
/**
 * Value satisfies operator !!val
 */
export declare function required(): PropertyValidator;
/**
 * Value satisfies operator !val
 */
export declare function empty(): PropertyValidator;
/**
 * Deep strict equals validator
 */
export declare function oneOf(vals: Array<any>, printActualVal?: boolean, serialize?: ((v: any) => string) | null): PropertyValidator;
/**
 * Validator allows anything
 */
export declare function any(): PropertyValidator;
/**
 * Validator allows nothing
 */
export declare function never(): PropertyValidator;
/**
 * Checks is value type of bigint, symbol, number, string,
 * boolean, null or undefined
 */
export declare function scalar(): PropertyValidator;
/**
 * Checks is property value is array of X
 */
export declare function arrayOf(itemValidator: PropertyValidator): PropertyValidator;