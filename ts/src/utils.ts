import { MakeProperty } from "./make"
import {PropertyValidator} from "./valid"

export const __classModelPropertiesKey = "__classModelProperties"

export type PropertyMeta = {
    makeModel: MakeProperty, 
    validator: PropertyValidator|null,
    label: string|null,
}


/**
 * Sets property to model
 */
export function setProperty(
    model: object, 
    propName: string|symbol, 
    label: string|null = null,
    validator: PropertyValidator|null = null,
    makeModel: MakeProperty|null = null
): void {
    if(!model[__classModelPropertiesKey]) {
        Object.defineProperty(model, __classModelPropertiesKey, {
            value: {},
            writable: true,
        })
    }
    model[__classModelPropertiesKey][propName] = {
        validator: validator, 
        label: label,
        makeModel: makeModel,
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
export function getPropertyValidator(
    model: object, 
    propName: string|symbol
): PropertyValidator|null {
    const propMeta = getPropertyMeta(model, propName)
    return (!propMeta || !propMeta["validator"])
        ? null
        : propMeta["validator"]
}

/**
 * Returns special constructor of property, is it exists
 */
export function getMaybeMakeModelFn(
    model: object, 
    propName: string|symbol
): null|MakeProperty {
    const propMeta = getPropertyMeta(model, propName)
    return (!propMeta || !propMeta.makeModel)
        ? null
        : propMeta.makeModel
}

/**
 * assert anonimous value by validator
 */
export function assertByValidator(
    val: any,
    validator: (propName: string|symbol, propLabel: string, propVal: any) => string[]
): void {
    const result = validator("", "(anonimous value)", val)
    if(result.length > 0) {
        throw new Error(result[0])
    }
}