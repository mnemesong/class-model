export * as utils from "./utils"
export * as validators from "./validators"

import * as utils from "./utils"
import { PropertyValidator } from "./validators"

/**
 * Decorator factory for defining property
 */
 export function property(
    label: string|null = null, 
    validators: Array<PropertyValidator>,
    specialConstructor: utils.SpecialConstructor|null = null
): PropertyDecorator {
    return (target, propKey) => {
        utils.setProperty(target, propKey, label, validators, specialConstructor)
    }
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
        const meta = utils.getAllPropertiesMeta(model)
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

/**
 * Validates object by registered validators and returns error messages array
 */
 export function validationErrors(model: object): Array<string> {
    let result = []
    const propMetas = utils.getAllPropertiesMeta(model)
    Object.keys(propMetas).forEach(propName => {
        propMetas[propName].validators.forEach((v: PropertyValidator) => {
            result = result.concat(v(propName, utils.getPropertyLabel(model, propName), model)) 
        })
    })
    return result
}