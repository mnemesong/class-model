import { PropertyValidator } from "./validators";
type SpecialConstructor = (data: any) => object;
export declare const __classModelPropertiesKey = "__classModelProperties";
export type PropertyMeta = {
    specialConstructor: SpecialConstructor;
    validators: Array<PropertyValidator>;
    label: string | null;
};
/**
 * Gets meta-structure with validators and label of property
 */
export declare function getPropertyMeta(model: object, propName: string | symbol): PropertyMeta | null;
/**
 * Get structure kind of {[registeredProperty]: [labelOfProperty]}
 */
export declare function getAllPropertiesLabels(model: object): {};
/**
 * Gets structure kind of {[registeredProperty]: {label: ..., validators: [...]}}
 */
export declare function getAllPropertiesMeta(model: object): Record<string, PropertyMeta>;
/**
 * Decorator factory for defining property
 */
export declare function property(label: string | null, validators: Array<PropertyValidator>, specialConstructor?: SpecialConstructor | null): PropertyDecorator;
/**
 * Get all properties as a string
 */
export declare function getProperties(obj: object): Array<string>;
/**
 * Returns label of property or returns property name
 * if special label had not been registered
 */
export declare function getPropertyLabel(model: object, propName: string | symbol): string;
/**
 * Returns all geristered validators of the property
 */
export declare function getPropertyValidators(model: object, propName: string | symbol): PropertyValidator[];
/**
 * Validates object by registered validators and returns error messages array
 */
export declare function validationErrors(model: object): Array<string>;
/**
 * Returns special constructor of property, is it exists
 */
export declare function getMaybeSpecialConstructor(model: object, propName: string | symbol): null | SpecialConstructor;
/**
 * Load data from object to model by all registered properties
 * Returns true if loading had been successfull, false else
 */
export declare function loadData(model: object, data: any): boolean;
export {};
