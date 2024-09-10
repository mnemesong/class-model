type PropertyValidator = (propName: string, propLabel: string, model: any) => string[]

export const __classModelPropertiesKey = "__classModelProperties"

export type PropertyMeta = {
    validators: Array<PropertyValidator>,
    label: string|null,
}

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

export function getAllPropertiesLabels(_class: any) {
    const meta = getAllPropertiesMeta(_class)
    const result = {}
    Object.keys(meta).forEach(k => {
        result[k] = !!meta[k].label ? meta[k].label : k
    })
    return result
}

export function getAllPropertiesMeta(
    _class: any
): Record<string, PropertyMeta> {
    if(!_class[__classModelPropertiesKey] || (typeof _class !== "object")) {
        return {}
    }
    return _class[__classModelPropertiesKey]
}

export function property(
    label: string|null = null, 
    validators: Array<PropertyValidator>
): PropertyDecorator {
    return (target, propKey) => {
        setProperty(target, propKey, label, validators)
    }
}

export function addValidators(
    _class: any, 
    propName: string, 
    validators: Array<PropertyValidator>
) {
    const propMeta = getPropertyMeta(_class, propName)
    if(!propMeta) {
        setProperty(_class, propName, null, validators)
        return
    }
    setProperty(
        _class, 
        propName, 
        propMeta.label, 
        propMeta.validators.concat(validators)
    )
}

export function clearAllValidators(
    _class: any
) {
    if(!_class[__classModelPropertiesKey]) {
        return
    }
    Object.keys(_class[__classModelPropertiesKey])
        .forEach((key) => {
            _class[__classModelPropertiesKey][key].validators = []
        })
}

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

export function getPropertyValidators(
    _class: any, 
    propName: string
): PropertyValidator[] {
    const propMeta = getPropertyMeta(_class, propName)
    return (!propMeta || !propMeta[propName] || !propMeta[propName]["validators"])
        ? []
        : propMeta[propName]["validators"]
}

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