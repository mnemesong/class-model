export * as utils from "./utils"
export * as valid from "./valid"
export * as make from "./make"

import * as utils from "./utils"
import { PropertyValidator } from "./valid"
import * as make from "./make"

/**
 * Decorator factory for defining property
 */
 export function property(
    label: string|null = null, 
    validator: PropertyValidator|null = null,
    makeModel: make.MakeProperty|null = null
): PropertyDecorator {
    return (target, propKey) => {
        utils.setProperty(target, propKey, label, validator, makeModel)
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
            model[p] = !!meta[p].makeModel
                ? (() => {
                    const maked = meta[p].makeModel(data[p])
                    return (maked === false)
                        ? data[p]
                        : maked
                })()
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
        result = result.concat(
            !propMetas[propName].validator 
                ? []
                : propMetas[propName].validator(
                    propName, 
                    utils.getPropertyLabel(model, propName), model[propName]
                )
        )
    })
    return result
}

/**
 * Assert model
 */
export function assertModel(
    model: object
): void {
    const errs = validationErrors(model)
    if(errs.length > 0) {
        throw new Error(errs[0])
    }
}