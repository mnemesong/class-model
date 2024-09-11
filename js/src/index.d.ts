export * as utils from "./utils";
export * as validators from "./validators";
export * as make from "./make";
import { PropertyValidator } from "./validators";
import * as make from "./make";
/**
 * Decorator factory for defining property
 */
export declare function property(label: string | null, validators: Array<PropertyValidator>, makeModel?: make.MakeModel | null): PropertyDecorator;
/**
 * Load data from object to model by all registered properties
 * Returns true if loading had been successfull, false else
 */
export declare function loadData(model: object, data: any): boolean;
/**
 * Validates object by registered validators and returns error messages array
 */
export declare function validationErrors(model: object): Array<string>;
