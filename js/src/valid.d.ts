export type PropertyValidator = (propName: string | symbol, propLabel: string, propVal: any) => string[];
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
 * Value satisfies filter function
 */
export declare function filterFn(filterFn: (v: any) => boolean): PropertyValidator;
/**
 * Check value is one of scalar enumeration
 */
export declare function oneOf(vals: Array<string | symbol | number | boolean | null | undefined | bigint>, printValue?: ValuePrinter | null): PropertyValidator;
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
export declare function arrayOf(itemValidator?: PropertyValidator | null): PropertyValidator;
/**
 * Checks is property value is array have n of X values
 */
export declare function arrayDeepStrictUnique(printVal?: ValuePrinter | null): PropertyValidator;
/**
 * Checks array count by function
 */
export declare function arrayCount(countCheckFn?: ((n: number) => boolean) | null): PropertyValidator;
/**
 * Checks property is a tuple match tuple of validators
 */
export declare function arrayTuple(valids?: PropertyValidator[] | null): PropertyValidator;
/**
 * Return errors if one of validators are return errors
 */
export declare function and(valids: PropertyValidator[]): PropertyValidator;
/**
 * Return errors if everyone of validators are return errors
 */
export declare function or(valids: PropertyValidator[]): PropertyValidator;
/**
 * Return errors if everyone of validators are return errors
 */
export declare function not(valid: PropertyValidator): PropertyValidator;
/**
 * Date validation by lambda
 */
export declare function date(valid?: ((d: Date) => string[] | boolean) | null): PropertyValidator;
/**
 * Validate number by lambda
 */
export declare function number(valid?: ((n: number) => string[] | boolean) | null): PropertyValidator;
/**
 * Checks object is instance of X
 */
export declare function objInstance(construct?: Function | null): PropertyValidator;
/**
 * Checks object is valid as a Model
 */
export declare function objValidModel(construct?: Function | null): PropertyValidator;
/**
 * Checks object has keys
 */
export declare function objHasKeys(keys: (string | symbol)[]): PropertyValidator;
/**
 * Checks object values by structure of validators
 */
export declare function objProps(propValidators: Record<string | symbol, PropertyValidator>): PropertyValidator;
/**
 * Validate string by lambda
 */
export declare function string(valid?: ((s: string) => string[] | boolean) | null): PropertyValidator;
/**
 * Validate string by lambda
 */
export declare function stringLength(valid?: ((s: number) => string[] | boolean) | null): PropertyValidator;
/**
 * Validate string by lambda
 */
export declare function stringRegMatch(regex: RegExp | string): PropertyValidator;
/**
 * Validate string by lambda
 */
export declare function stringUuid(): PropertyValidator;
/**
 * Validate boolean value
 */
export declare function boolean(valid?: ((s: boolean) => string[] | boolean) | null): PropertyValidator;
/**
 * validate Symbol value
 */
export declare function symbol(valid?: ((s: symbol) => string[] | boolean) | null): PropertyValidator;
/**
 * Validate value is Null
 */
export declare function isNull(): PropertyValidator;
/**
 * Validate value is Undefined
 */
export declare function isUndefined(): PropertyValidator;
/**
 * Validate value is function
 */
export declare function func(valid?: ((s: Function) => string[] | boolean) | null): PropertyValidator;
/**
 * Validate value by lambda
 */
export declare function lambda(valid: (a: any) => boolean | string[]): PropertyValidator;
/**
 * Modify any validator. Allows falsable values
 */
export declare function maybe(valid: PropertyValidator): PropertyValidator;
