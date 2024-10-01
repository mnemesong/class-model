export * as utils from "./utils";
export * as valid from "./valid";
export * as make from "./make";
import { PropertyValidator } from "./valid";
import * as make from "./make";
/**
 * Decorator factory for defining property
 */
export declare function property(label?: string | null, validator?: PropertyValidator | null, makeModel?: make.MakeProperty | null): PropertyDecorator;
/**
 * Load data from object to model by all registered properties
 * Returns true if loading had been successfull, false else
 */
export declare function loadData(model: object, data: any, errPrint?: ((e: any) => void) | null): boolean;
/**
 * Validates object by registered validators and returns error messages array
 */
export declare function validationErrors(model: object): Array<string>;
/**
 * Assert model
 */
export declare function assertModel(model: object): void;
/**
 * Transforms class to structure
 */
export declare function toStructure<T extends {}>(model: T): Pick<T, keyof T>;
/**
 * Creates model, loads and validate it
 * Throws error on failure, returns loaded model instance in success
 */
export declare function loadValidAssert<T extends {}>(getModel: () => T, data: any): T;
/**
 * Assert data is array, loads and validates it as array of models
 */
export declare function loadValidAssertArray<T extends {}>(getModel: () => T, data: any): T[];
