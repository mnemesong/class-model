type PropertyValidator = (propName: string, propLabel: string, model: any) => string[];
export declare const __classModelPropertiesKey = "__classModelProperties";
export type PropertyMeta = {
    validators: Array<PropertyValidator>;
    label: string | null;
};
export declare function getPropertyMeta(_class: any, propName: string): PropertyMeta | null;
export declare function getAllPropertiesLabels(_class: any): {};
export declare function getAllPropertiesMeta(_class: any): Record<string, PropertyMeta>;
export declare function property(label: string | null, validators: Array<PropertyValidator>): PropertyDecorator;
export declare function addValidators(_class: any, propName: string, validators: Array<PropertyValidator>): void;
export declare function clearAllValidators(_class: any): void;
export declare function getPropertyLabel(_class: any, propName: string): string;
export declare function getPropertyValidators(_class: any, propName: string): PropertyValidator[];
export declare function validationErrors(model: any): Array<string>;
export declare function loadData(model: any, data: any): boolean;
export {};
