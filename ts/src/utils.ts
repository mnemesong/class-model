import {PropertyValidator} from "./validators"
type SpecialConstructor = (data: any) => object

export const __classModelPropertiesKey = "__classModelProperties"

export type PropertyMeta = {
    specialConstructor: SpecialConstructor, 
    validators: Array<PropertyValidator>,
    label: string|null,
}

/**
 * Sets property to model
 */
function setProperty(
    model: object, 
    propName: string|symbol, 
    label: string|null = null,
    validators: Array<PropertyValidator> = [],
    specialConstructor: SpecialConstructor|null = null
): void {
    if(!model[__classModelPropertiesKey]) {
        Object.defineProperty(model, __classModelPropertiesKey, {
            value: {},
            writable: true,
        })
    }
    model[__classModelPropertiesKey][propName] = {
        validators: validators, 
        label: label,
        specialConstructor: specialConstructor,
    }
}

/**
 * Gets meta-structure with validators and label of property
 */
export function getPropertyMeta(
    model: object, 
    propName: string|symbol
): PropertyMeta|null {
    if(!model[__classModelPropertiesKey]) {
        return null
    }
    if(!model[__classModelPropertiesKey][propName]) {
        return null
    }
    return model[__classModelPropertiesKey][propName]
}

/**
 * Get structure kind of {[registeredProperty]: [labelOfProperty]}
 */
export function getAllPropertiesLabels(model: object) {
    const meta = getAllPropertiesMeta(model)
    const result = {}
    Object.keys(meta).forEach(k => {
        result[k] = !!meta[k].label ? meta[k].label : k
    })
    return result
}

/**
 * Gets structure kind of {[registeredProperty]: {label: ..., validators: [...]}}
 */
export function getAllPropertiesMeta(
    model: object
): Record<string, PropertyMeta> {
    if(!model[__classModelPropertiesKey] || (typeof model !== "object")) {
        return {}
    }
    return model[__classModelPropertiesKey]
}

/**
 * Decorator factory for defining property
 */
export function property(
    label: string|null = null, 
    validators: Array<PropertyValidator>,
    specialConstructor: SpecialConstructor|null = null
): PropertyDecorator {
    return (target, propKey) => {
        setProperty(target, propKey, label, validators, specialConstructor)
    }
}

/**
 * Get all properties as a string
 */
export function getProperties(
    obj: object,
): Array<string> {
    const meta = getAllPropertiesMeta(obj)
    if(!meta || (typeof meta !== "object")) {
        return []
    }
    return Object.keys(meta)
}

/**
 * Returns label of property or returns property name 
 * if special label had not been registered
 */
export function getPropertyLabel(
    model: object, 
    propName: string|symbol
): string {
    const propMeta = getPropertyMeta(model, propName)
    const label = (!propMeta || !propMeta["label"])
        ? null
        : propMeta["label"]
    return !!label
        ? label
        : ((typeof propName === "string")
            ? propName
            : propName.toString())
}

/**
 * Returns all geristered validators of the property
 */
export function getPropertyValidators(
    model: object, 
    propName: string|symbol
): PropertyValidator[] {
    const propMeta = getPropertyMeta(model, propName)
    return (!propMeta || !propMeta["validators"])
        ? []
        : propMeta["validators"]
}

/**
 * Validates object by registered validators and returns error messages array
 */
export function validationErrors(model: object): Array<string> {
    let result = []
    const propMetas = getAllPropertiesMeta(model)
    Object.keys(propMetas).forEach(propName => {
        propMetas[propName].validators.forEach((v: PropertyValidator) => {
            result = result.concat(v(propName, getPropertyLabel(model, propName), model)) 
        })
    })
    return result
}

/**
 * Returns special constructor of property, is it exists
 */
export function getMaybeSpecialConstructor(
    model: object, 
    propName: string|symbol
): null|SpecialConstructor {
    const propMeta = getPropertyMeta(model, propName)
    return (!propMeta || !propMeta.specialConstructor)
        ? null
        : propMeta.specialConstructor
}

/**
 * Load data from object to model by all registered properties 
 * Returns true if loading had been successfull, false else
 */
export function loadData(model: object, data: any): boolean {
    if(typeof data !== "object") {
        return false
    }
    const oldVals = {}
    try {
        const meta = getAllPropertiesMeta(model)
        const props = Object.keys(meta)
        props.forEach(p => {
            oldVals[p] = model[p]
            model[p] = !!meta[p].specialConstructor
                ? meta[p].specialConstructor(data[p])
                : data[p]
        })
        return true
    } catch (e) {
        Object.keys(oldVals).forEach(k => {
            model[k] = oldVals[k]
        })
        return false
    }
}