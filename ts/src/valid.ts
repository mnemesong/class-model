import { isDeepStrictEqual } from "util"
import { validationErrors } from "."
import { getPropertyLabel } from "./utils"

export type PropertyValidator = (propName: string|symbol, propLabel: string, propVal: any) => string[]

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
 * Value satisfies filter function
 */
 export function filterFn(
    filterFn: (v: any) => boolean
 ): PropertyValidator {
    return function(propName, propLabel, propVal) {
        return (!filterFn(propVal))
            ? [propLabel + " should match filter function"]
            : []
    }
}

/**
 * Check value is one of scalar enumeration
 */
 export function oneOf(
    vals: Array<string|symbol|number|boolean|null|undefined|bigint>,
    printValue: ValuePrinter|null = null
): PropertyValidator {
    return function(propName, propLabel, propVal) {
        return (vals.includes(propVal))
            ? []
            : [propLabel + " should be one of"
                + " [" + vals.map(v => JSON.stringify(v)).join(", ") + "]"
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
    itemValidator: PropertyValidator|null = null,
): PropertyValidator {
    return function(propName, propLabel, propVal) {
        if(!Array.isArray(propVal)) {
            return ["Property " + propLabel + " should be array, gets "
            + (typeof propVal)]
        }
        if(!itemValidator) {
            return []
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
    countCheckFn: ((n: number) => boolean)|null = null
): PropertyValidator {
    return function(propName, propLabel, propVal) {
        if(!Array.isArray(propVal)) {
            return ["Property " + propLabel + " should be array, gets "
            + (typeof propVal)]
        }
        if(!countCheckFn) {
            return []
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
   valids: PropertyValidator[]|null = null
): PropertyValidator {
    return function(propName, propLabel, propVal) {
        if(!Array.isArray(propVal)) {
            return ["Property " + propLabel + " should be array, gets "
            + (typeof propVal)]
        }
        if(!valids) {
            return []
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

/**
 * Date validation by lambda
 */
export function date(
   valid: ((d:Date) => string[]|boolean)|null = null
): PropertyValidator {
    return function(propName, propLabel, propVal) {
        if(!(propVal instanceof Date)) {
            return ["Property " + propLabel + " is not a Date"];
        }
        if(!valid) {
            return [];
        }
        const result = valid(propVal)
        if(typeof result === "boolean") {
            return !result
                ? [propLabel + " is invalid date value " + propVal.toDateString()]
                : []
        }
        return result
    }
}

/**
 * Validate number by lambda
 */
export function number(
    valid: ((n: number) => string[]|boolean)|null = null
): PropertyValidator {
    return function(propName, propLabel, propVal) {
        if(typeof propVal !== "number") {
            return ["Property " + propLabel + " is not a number"];
        }
        if(!valid) {
            return [];
        }
        const result = valid(propVal)
        if(typeof result === "boolean") {
            return !result
                ? [propLabel + " is invalid number value " + JSON.stringify(propVal)]
                : []
        }
        return result
            .map(err => "In property " + propLabel + ": " + err)
    }
}

/**
 * Checks object is instance of X
 */
export function objInstance(
    construct: Function|null = null
): PropertyValidator {
    return function(propName, propLabel, propVal) {
        const className = !construct ? "object" : construct.name
        if(typeof propVal !== "object") {
            return [propLabel + " should be object, gets " + (typeof propVal)]
        }
        if(!construct) {
            return []
        }
        if(!(propVal instanceof construct)) {
            return [propLabel + " should be instance of " + className
                + ", gets instance of " + propVal.constructor.name]
        }
        return []
    }
}

/**
 * Checks object is valid as a Model
 */
 export function objValidModel(): PropertyValidator {
    return function(propName, propLabel, propVal) {
        if(typeof propVal !== "object") {
            return [propLabel + " should be object, gets " + (typeof propVal)]
        }
        return validationErrors(propVal)
            .map(err => propLabel + " should be valid Model, but in it: " + err)
    }
}

/**
 * Checks object has keys
 */
 export function objHasKeys(keys: (string|symbol)[]): PropertyValidator {
    return function(propName, propLabel, propVal) {
        if(typeof propVal !== "object") {
            return [propLabel + " should be object, gets " + (typeof propVal)]
        }
        const objectKeys = Object.getOwnPropertyNames(propVal)
        const objectOwnPropSymbols = Object.getOwnPropertySymbols(propVal)
        return keys.reduce((errs: string[], k) => {
            return (typeof k === "symbol")
                ? (objectOwnPropSymbols.includes(k)
                    ? errs
                    : errs.concat([propLabel + " should contains key " + k.toString()]))
                : (objectKeys.includes(k)
                    ? errs
                    : errs.concat([propLabel + " should contains key " + k]))
        }, [])
    }
}

/**
 * Checks object values by structure of validators
 */
 export function objProps(
    propValidators: Record<string|symbol, PropertyValidator>
): PropertyValidator {
    return function(propName, propLabel, propVal) {
        if(typeof propVal !== "object") {
            return [propLabel + " should be object, gets " + (typeof propVal)]
        }
        const objectKeys = Object.getOwnPropertyNames(propVal)
        const objectOwnPropSymbols = Object.getOwnPropertySymbols(propVal)
        return (Object.getOwnPropertyNames(propValidators) as (string|symbol)[])
            .concat(Object.getOwnPropertySymbols(propValidators))
            .reduce((errs: string[], k) => {
                return errs
                    .concat(propValidators[k](k, getPropertyLabel(propVal, k), propVal[k]))
            }, [])
            .map(err => propLabel + " contains object, checks by property: " + err)
    }
}

/**
 * Validate string by lambda
 */
 export function string(
    valid: ((s: string) => string[]|boolean)|null = null
): PropertyValidator {
    return function(propName, propLabel, propVal) {
        if(typeof propVal !== "string") {
            return ["Property " + propLabel + " is not a string"];
        }
        if(!valid) {
            return [];
        }
        const result = valid(propVal)
        if(typeof result === "boolean") {
            return !result
                ? [propLabel + " is invalid string value " + JSON.stringify(propVal)]
                : []
        }
        return result
            .map(err => "In property " + propLabel + ": " + err)
    }
}

/**
 * Validate string by lambda
 */
 export function stringLength(
    valid: ((s: number) => string[]|boolean)|null = null
): PropertyValidator {
    return function(propName, propLabel, propVal) {
        if(typeof propVal !== "string") {
            return ["Property " + propLabel + " is not a string"];
        }
        if(!valid) {
            return [];
        }
        const result = valid(propVal.length)
        if(typeof result === "boolean") {
            return !result
                ? [propLabel + " is invalid length of string value " + JSON.stringify(propVal)]
                : []
        }
        return result
            .map(err => "In property " + propLabel + ": " + err)
    }
}

/**
 * Validate string by lambda
 */
 export function stringRegMatch(
    regex: RegExp|string
): PropertyValidator {
    return function(propName, propLabel, propVal) {
        if(typeof propVal !== "string") {
            return ["Property " + propLabel + " is not a string"];
        }
        const result = propVal.match(regex)
        if(!!result && (result.length > 0)) {
            return []
        }
        return (!!result && (result.length > 0))
            ? []
            : ["In property " + propLabel + " string \"" + propVal 
                + "\" is not metch regular expression " 
                + ((typeof regex === "string") ? regex : regex.toString())]
    }
}

/**
 * Validate string by lambda
 */
 export function stringUuid(): PropertyValidator {
    return stringRegMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    )
}

/**
 * Validate boolean value
 */
export function boolean(
    valid: ((s: boolean) => string[]|boolean)|null = null
): PropertyValidator {
    return function(propName, propLabel, propVal) {
        if(typeof propVal !== "boolean") {
            return ["Property " + propLabel + " is not a boolean"];
        }
        if(!valid) {
            return [];
        }
        const result = valid(propVal)
        if(typeof result === "boolean") {
            return !result
                ? [propLabel + " is invalid boolean value " + JSON.stringify(propVal)]
                : []
        }
        return result
            .map(err => "In property " + propLabel + ": " + err)
    }
}

/**
 * validate Symbol value
 */
export function symbol(
    valid: ((s: symbol) => string[]|boolean)|null = null
): PropertyValidator {
    return function(propName, propLabel, propVal) {
        if(typeof propVal !== "symbol") {
            return ["Property " + propLabel + " is not a symbol"];
        }
        if(!valid) {
            return [];
        }
        const result = valid(propVal)
        if(typeof result === "boolean") {
            return !result
                ? [propLabel + " is invalid symbol value " + propVal.toString()]
                : []
        }
        return result
            .map(err => "In property " + propLabel + ": " + err)
    }
}

/**
 * Validate value is Null
 */
export function isNull(): PropertyValidator {
    return function(propName, propLabel, propVal) {
        if(propVal !== null) {
            return ["Property " + propLabel + " is not a null"];
        }
        return []
    }
}

/**
 * Validate value is Undefined
 */
export function isUndefined(): PropertyValidator {
    return function(propName, propLabel, propVal) {
        if(propVal !== undefined) {
            return ["Property " + propLabel + " is not a undefined"];
        }
        return []
    }
}

/**
 * Validate value is function
 */
export function func(
    valid: ((s: Function) => string[]|boolean)|null = null
): PropertyValidator {
    return function(propName, propLabel, propVal) {
        if(typeof propVal !== "function") {
            return ["Property " + propLabel + " is not a function"];
        }
        if(!valid) {
            return [];
        }
        const result = valid(propVal)
        if(typeof result === "boolean") {
            return !result
                ? [propLabel + " is invalid function value " + propVal.toString()]
                : []
        }
        return result
            .map(err => "In property " + propLabel + ": " + err)
    }
}

/**
 * Validate value by lambda
 */
export function lambda(
    valid: (a: any) => boolean|string[],
): PropertyValidator {
    return function(propName, propLabel, propVal) {
        const result = valid(propVal)
        if(typeof result === "boolean") {
            return !result
                ? [propLabel + " is invalid value"]
                : []
        }
        return result
    }
}