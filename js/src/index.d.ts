type PropertyValidator = (propName: string, propLabel: string, model: any) => string[];
export declare const __classModelPropertiesKey = "__classModelProperties";
export type PropertyMeta = {
    validators: Array<PropertyValidator>;
    label: string | null;
};
/**
 * Gets meta-structure with validators and label of property
 */
export declare function getPropertyMeta(_class: any, propName: string): PropertyMeta | null;
/**
 * Get structure kind of {[registeredProperty]: [labelOfProperty]}
 */
export declare function getAllPropertiesLabels(_class: any): {};
/**
 * Gets structure kind of {[registeredProperty]: {label: ..., validators: [...]}}
 */
export declare function getAllPropertiesMeta(_class: any): Record<string, PropertyMeta>;
/**
 * Decorator factory for defining property
 */
export declare function property(label: string | null, validators: Array<PropertyValidator>): PropertyDecorator;
/**
 * Get all properties as a string
 */
export declare function getProperties(obj: object): Array<string>;
/**
 * Returns label of property or returns property name
 * if special label had not been registered
 */
export declare function getPropertyLabel(_class: any, propName: string): string;
/**
 * Returns all geristered validators of the property
 */
export declare function getPropertyValidators(_class: any, propName: string): PropertyValidator[];
/**
 * Validates object by registered validators and returns error messages array
 */
export declare function validationErrors(model: any): Array<string>;
/**
 * Load data from object to model by all registered properties
 * Returns true if loading had been successfull, false else
 */
export declare function loadData(model: any, data: any): boolean;
export {};
