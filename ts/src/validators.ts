import { isDeepStrictEqual } from "util"

export type PropertyValidator = (propName: string, propLabel: string, model: any) => string[]

/**
 * Strict not deep equals to scalar val
 */
export function strictEquals(
    val: string|bigint|number|boolean|null|undefined|symbol,
    printActualVal: boolean = false
): PropertyValidator {
    return function(propName, propLabel, model) {
        return (model[propName] === val)
            ? []
            : [propLabel + " should be equals to " + JSON.stringify(val)
                + (printActualVal 
                    ? (" but actual it is " + JSON.stringify(model[propName])) 
                    : "")]
    }
}

/**
 * Deep strict equals validator
 */
export function strictDeepEquals(
    val: any,
    printActualVal: boolean = false,
    serialize: ((v) => string)|null = null
): PropertyValidator {
    if(!serialize) {
        serialize = ((v) => JSON.stringify(v))
    }
    return function(propName, propLabel, model) {
        return (isDeepStrictEqual(model[propName], val))
            ? []
            : [propLabel + " should be equals to " + serialize(val)
                + (printActualVal 
                    ? (" but actual it is " + serialize(model[propName])) 
                    : "")]
    }
}