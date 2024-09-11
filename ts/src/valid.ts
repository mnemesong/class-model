import { isDeepStrictEqual } from "util"

export type PropertyValidator = (propName: string, propLabel: string, propVal: any) => string[]

export type ValuePrinter = (v: any) => string

/**
 * Strict not deep equals to scalar val
 */
export function strictEqual(
    val: string|bigint|number|boolean|null|undefined|symbol,
    printValue: ValuePrinter|null = null
): PropertyValidator {
    return function(propName, propLabel, propVal) {
        return (propVal === val)
            ? []
            : [propLabel + " should be equals to " + JSON.stringify(val)
                + ((printValue === null) 
                    ? ""
                    : (", but actual it is " + printValue(propVal)) )]
    }
}

/**
 * Deep strict equals validator
 */
export function strictDeepEqual(
    val: any,
    printValue: ValuePrinter|null = null
): PropertyValidator {
    return function(propName, propLabel, propVal) {
        return (isDeepStrictEqual(propVal, val))
            ? []
            : [propLabel + " should be equals to "
                + ((printValue === null) ? "special value" : printValue(val))
                + ((printValue === null) 
                    ? "" 
                    : (", but actual it is " + printValue(propVal)))]
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
    printValue: ValuePrinter|null = null
): PropertyValidator {
    return function(propName, propLabel, propVal) {
        return (vals.includes(propVal))
            ? []
            : [propLabel + " should be one of"
                + ((printValue === null) 
                    ? "special values" 
                    : (" [" + vals.map(v => printValue(v)).join(", ")) + "]")
                + ((printValue === null) 
                ? "" 
                : (", but actual it is " + printValue(propVal)))]
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
 * boolean or undefined
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
            "undefined"
        ].includes(typeofPropVal))
            ? []
            : [propLabel + " should be scalar, but it instance of " + (typeofPropVal)
                + (typeofPropVal !== "object" 
                    ? ""
                    : (((propVal === null) 
                        || !propVal["constructor"] 
                        || !propVal["constructor"]["name"])
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

/**
 * Checks is property value is array have n of X values
 */
 export function arrayDeepStrictUnique(
    printVal: ValuePrinter|null = null
 ): PropertyValidator {
    return function(propName, propLabel, propVal) {
        if(!Array.isArray(propVal)) {
            return ["Property " + propLabel + " should be array, gets "
            + (typeof propVal)]
        }
        const filtered = propVal.reduce((acc, el) => {
            if(acc !== undefined) {
                return acc
            }
            const filterFn = (typeof el === "object")
                ? ((v: object) => isDeepStrictEqual(v, el))
                : ((v: any) => v === el)
            return propVal.filter(filterFn)[1]
        }, undefined)
        return (filtered === undefined)
            ? []
            : [propLabel + " should be array of unique values. Found not unique element"
                + ((printVal === null) ? "" : (": " + printVal(filtered)))];
    }
}

/**
 * Checks array count by function
 */
export function arrayCount(
    countCheckFn: ((n: number) => boolean)
): PropertyValidator {
    return function(propName, propLabel, propVal) {
        if(!Array.isArray(propVal)) {
            return ["Property " + propLabel + " should be array, gets "
            + (typeof propVal)]
        }
        const arrayCount = propVal.length
        return (countCheckFn(arrayCount))
            ? []
            : [propLabel + " contains array invalid count of items: " + arrayCount];
    }
}

/**
 * Checks property is a tuple match tuple of validators
 */
export function arrayTuple(
   valids: PropertyValidator[]
): PropertyValidator {
    return function(propName, propLabel, propVal) {
        if(!Array.isArray(propVal)) {
            return ["Property " + propLabel + " should be array, gets "
            + (typeof propVal)]
        }
        return valids.reduce((acc, el, i) => {
            return acc.concat(el(propName, "item of " + propLabel, propVal[i]))
        }, [])
            .map(err => "In property A tuple: " + err)
    }
}

/**
 * Return errors if one of validators are return errors
 */
export function and(
   valids: PropertyValidator[]
): PropertyValidator {
    return function(propName, propLabel, propVal) {
        return valids.reduce((acc: string[], el) => {
            return el(propName, propLabel, propVal)
        }, [])
    }
}

/**
 * Return errors if everyone of validators are return errors
 */
export function or(
   valids: PropertyValidator[]
): PropertyValidator {
    return function(propName, propLabel, propVal) {
        const validResult = valids.map(v => {
            return v(propName, propLabel, propVal)
        })
        return (validResult.findIndex((errs) => errs.length === 0) === -1)
            ? validResult.reduce((acc, el) => acc.concat(el), [])
            : []
    }
}

/**
 * Return errors if everyone of validators are return errors
 */
 export function not(
   valid: PropertyValidator
): PropertyValidator {
    return function(propName, propLabel, propVal) {
        const validResult = valid(propName, propLabel, propVal)
        return (validResult.length === 0)
            ? ["Value allows condition, thats should not"]
            : []
    }
}

