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
export declare function addValidators(_class: any, propName: string, validators: Array<PropertyValidator>): void;
export declare function clearAllValidators(_class: any): void;
export declare function getPropertyLabel(_class: any, propName: string): string;
export declare function getPropertyValidators(_class: any, propName: string): PropertyValidator[];
export declare function validationErrors(model: any): Array<string>;
export declare function loadData(model: any, data: any): boolean;
export {};
