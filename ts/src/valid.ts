import { isDeepStrictEqual } from "util"
import { MakeProperty } from "./make"

export type PropertyValidator = (propName: string, propLabel: string, propVal: any) => string[]

/**
 * Strict not deep equals to scalar val
 */
export function strictEqual(
    val: string|bigint|number|boolean|null|undefined|symbol,
    printActualVal: boolean = false
): PropertyValidator {
    return function(propName, propLabel, propVal) {
        return (propVal === val)
            ? []
            : [propLabel + " should be equals to " + JSON.stringify(val)
                + (printActualVal 
                    ? (" but actual it is " + JSON.stringify(propVal)) 
                    : "")]
    }
}

/**
 * Deep strict equals validator
 */
export function strictDeepEqual(
    val: any,
    printActualVal: boolean = false,
    serialize: ((v) => string)|null = null
): PropertyValidator {
    if(!serialize) {
        serialize = ((v) => JSON.stringify(v))
    }
    return function(propName, propLabel, propVal) {
        return (isDeepStrictEqual(propVal, val))
            ? []
            : [propLabel + " should be equals to " + serialize(val)
                + (printActualVal 
                    ? (" but actual it is " + serialize(propVal)) 
                    : "")]
    }
}

/**
 * Value satisfies operator !!val
 */
export function required(): PropertyValidator {
    return function(propName, propLabel, propVal) {
        return (!propVal)
            ? [propLabel + " is required property"]
            : []
    }
}

/**
 * Value satisfies operator !val
 */
 export function empty(): PropertyValidator {
    return function(propName, propLabel, propVal) {
        return (!propVal)
            ? []
            : [propLabel + " should be empty"]
    }
}

/**
 * Deep strict equals validator
 */
 export function oneOf(
    vals: Array<any>,
    printActualVal: boolean = false,
    serialize: ((v) => string)|null = null
): PropertyValidator {
    if(!serialize) {
        serialize = ((v) => JSON.stringify(v))
    }
    return function(propName, propLabel, propVal) {
        return (vals.includes(propVal))
            ? []
            : [propLabel + " should be one of " + JSON.stringify(vals)
                + (printActualVal 
                    ? (" but actual it is " + serialize(propVal)) 
                    : "")]
    }
}

/**
 * Validator allows anything
 */
export function any(): PropertyValidator {
    return function(propName, propLabel, propVal) {
        return []
    }
}

/**
 * Validator allows nothing
 */
 export function never(): PropertyValidator {
    return function(propName, propLabel, propVal) {
        return ["This validator is always fails"]
    }
}

/**
 * Checks is value type of bigint, symbol, number, string,
 * boolean, null or undefined
 */
export function scalar(): PropertyValidator {
    return function(propName, propLabel, propVal) {
        const typeofPropVal = typeof propVal
        return ([
            "bigint", 
            "symbol", 
            "number", 
            "string", 
            "boolean", 
            "null", 
            "undefined"
        ].includes(typeofPropVal))
            ? []
            : [propLabel + " should be scalar, but it instance of " + (typeofPropVal)
                + (typeofPropVal !== "object" 
                    ? ""
                    : ((!propVal["constructor"] || !propVal["constructor"]["name"])
                        ? ""
                        : (":" + propVal["constructor"]["name"])))
                + (typeofPropVal !== "function" 
                    ? ""
                    : ((!propVal["name"])
                        ? ""
                        : (":" + propVal["name"])))
                ]
    }
}

/**
 * Checks is property value is array of X
 */
export function arrayOf(
    itemValidator: PropertyValidator,
): PropertyValidator {
    return function(propName, propLabel, propVal) {
        if(!Array.isArray(propVal)) {
            return ["Property " + propLabel + " should be array, gets "
            + (typeof propVal)]
        }
        const propertiesValidationResult: string[] = propVal.reduce((acc: string[], el) => {
            return (acc.length === 0)
                ? itemValidator(propName, "item of " + propLabel, el)
                : acc
        }, [])
        return (propertiesValidationResult.length === 0)
            ? []
            : propertiesValidationResult.map(e => {
                return "One or more elements in array fail validation: " + e
            })
    }
}