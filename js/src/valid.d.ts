export type PropertyValidator = (propName: string, propLabel: string, propVal: any) => string[];
export type ValuePrinter = (v: any) => string;
/**
 * Strict not deep equals to scalar val
 */
export declare function strictEqual(val: string | bigint | number | boolean | null | undefined | symbol, printValue?: ValuePrinter | null): PropertyValidator;
/**
 * Deep strict equals validator
 */
export declare function strictDeepEqual(val: any, printValue?: ValuePrinter | null): PropertyValidator;
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
export declare function oneOf(vals: Array<any>, printValue?: ValuePrinter | null): PropertyValidator;
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
 * boolean or undefined
 */
export declare function scalar(): PropertyValidator;
/**
 * Checks is property value is array of X
 */
export declare function arrayOf(itemValidator: PropertyValidator): PropertyValidator;
/**
 * Checks is property value is array have n of X values
 */
export declare function arrayDeepStrictUnique(printVal?: ValuePrinter | null): PropertyValidator;
/**
 * Checks array count by function
 */
export declare function arrayCount(countCheckFn: ((n: number) => boolean)): PropertyValidator;
/**
 * Checks property is a tuple match tuple of validators
 */
export declare function arrayTuple(valids: PropertyValidator[]): PropertyValidator;
