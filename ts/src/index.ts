type PropertyValidator = (propName: string, propLabel: string, model: any) => string[]

export const __classModelPropertiesKey = "__classModelProperties"

export type PropertyMeta = {
    validators: Array<PropertyValidator>,
    label: string|null,
}

/**
 * Sets property to model
 */
function setProperty(
    _class: any, 
    propName: string|symbol|number, 
    label: string|null = null,
    validators: Array<PropertyValidator> = []
): void {
    if(!_class[__classModelPropertiesKey]) {
        Object.defineProperty(_class, __classModelPropertiesKey, {
            value: {},
            writable: true,
        })
    }
    _class[__classModelPropertiesKey][propName] = {
        validators: validators, 
        label: label
    }
}

/**
 * Gets meta-structure with validators and label of property
 */
export function getPropertyMeta(
    _class: any, 
    propName: string
): PropertyMeta|null {
    if(!_class[__classModelPropertiesKey]) {
        return null
    }
    if(!_class[__classModelPropertiesKey][propName]) {
        return null
    }
    return _class[__classModelPropertiesKey][propName]
}

/**
 * Get structure kind of {[registeredProperty]: [labelOfProperty]}
 */
export function getAllPropertiesLabels(_class: any) {
    const meta = getAllPropertiesMeta(_class)
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
    _class: any
): Record<string, PropertyMeta> {
    if(!_class[__classModelPropertiesKey] || (typeof _class !== "object")) {
        return {}
    }
    return _class[__classModelPropertiesKey]
}

/**
 * Decorator factory for defining property
 */
export function property(
    label: string|null = null, 
    validators: Array<PropertyValidator>
): PropertyDecorator {
    return (target, propKey) => {
        setProperty(target, propKey, label, validators)
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
    _class: any, 
    propName: string
): string {
    const propMeta = getPropertyMeta(_class, propName)
    const label = (!propMeta || !propMeta["label"])
        ? null
        : propMeta["label"]
    return !!label
        ? label
        : propName
}

/**
 * Returns all geristered validators of the property
 */
export function getPropertyValidators(
    _class: any, 
    propName: string
): PropertyValidator[] {
    const propMeta = getPropertyMeta(_class, propName)
    return (!propMeta || !propMeta["validators"])
        ? []
        : propMeta["validators"]
}

/**
 * Validates object by registered validators and returns error messages array
 */
export function validationErrors(model: any): Array<string> {
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
 * Load data from object to model by all registered properties 
 * Returns true if loading had been successfull, false else
 */
export function loadData(model: any, data: any): boolean {
    if(typeof data !== "object") {
        return false
    }
    const oldVals = {}
    try {
        const meta = getAllPropertiesMeta(model)
        const props = Object.keys(meta)
        props.forEach(p => {
            oldVals[p] = model[p]
            model[p] = data[p]
        })
        return true
    } catch (e) {
        Object.keys(oldVals).forEach(k => {
            model[k] = oldVals[k]
        })
        return false
    }
}