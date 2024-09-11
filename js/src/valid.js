"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.not = exports.or = exports.and = exports.arrayTuple = exports.arrayCount = exports.arrayDeepStrictUnique = exports.arrayOf = exports.scalar = exports.never = exports.any = exports.oneOf = exports.empty = exports.required = exports.strictDeepEqual = exports.strictEqual = void 0;
var util_1 = require("util");
/**
 * Strict not deep equals to scalar val
 */
function strictEqual(val, printValue) {
    if (printValue === void 0) { printValue = null; }
    return function (propName, propLabel, propVal) {
        return (propVal === val)
            ? []
            : [propLabel + " should be equals to " + JSON.stringify(val)
                    + ((printValue === null)
                        ? ""
                        : (", but actual it is " + printValue(propVal)))];
    };
}
exports.strictEqual = strictEqual;
/**
 * Deep strict equals validator
 */
function strictDeepEqual(val, printValue) {
    if (printValue === void 0) { printValue = null; }
    return function (propName, propLabel, propVal) {
        return ((0, util_1.isDeepStrictEqual)(propVal, val))
            ? []
            : [propLabel + " should be equals to "
                    + ((printValue === null) ? "special value" : printValue(val))
                    + ((printValue === null)
                        ? ""
                        : (", but actual it is " + printValue(propVal)))];
    };
}
exports.strictDeepEqual = strictDeepEqual;
/**
 * Value satisfies operator !!val
 */
function required() {
    return function (propName, propLabel, propVal) {
        return (!propVal)
            ? [propLabel + " is required property"]
            : [];
    };
}
exports.required = required;
/**
 * Value satisfies operator !val
 */
function empty() {
    return function (propName, propLabel, propVal) {
        return (!propVal)
            ? []
            : [propLabel + " should be empty"];
    };
}
exports.empty = empty;
/**
 * Deep strict equals validator
 */
function oneOf(vals, printValue) {
    if (printValue === void 0) { printValue = null; }
    return function (propName, propLabel, propVal) {
        return (vals.includes(propVal))
            ? []
            : [propLabel + " should be one of"
                    + ((printValue === null)
                        ? "special values"
                        : (" [" + vals.map(function (v) { return printValue(v); }).join(", ")) + "]")
                    + ((printValue === null)
                        ? ""
                        : (", but actual it is " + printValue(propVal)))];
    };
}
exports.oneOf = oneOf;
/**
 * Validator allows anything
 */
function any() {
    return function (propName, propLabel, propVal) {
        return [];
    };
}
exports.any = any;
/**
 * Validator allows nothing
 */
function never() {
    return function (propName, propLabel, propVal) {
        return ["This validator is always fails"];
    };
}
exports.never = never;
/**
 * Checks is value type of bigint, symbol, number, string,
 * boolean or undefined
 */
function scalar() {
    return function (propName, propLabel, propVal) {
        var typeofPropVal = typeof propVal;
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
            ];
    };
}
exports.scalar = scalar;
/**
 * Checks is property value is array of X
 */
function arrayOf(itemValidator) {
    return function (propName, propLabel, propVal) {
        if (!Array.isArray(propVal)) {
            return ["Property " + propLabel + " should be array, gets "
                    + (typeof propVal)];
        }
        var propertiesValidationResult = propVal.reduce(function (acc, el) {
            return (acc.length === 0)
                ? itemValidator(propName, "item of " + propLabel, el)
                : acc;
        }, []);
        return (propertiesValidationResult.length === 0)
            ? []
            : propertiesValidationResult.map(function (e) {
                return "One or more elements in array fail validation: " + e;
            });
    };
}
exports.arrayOf = arrayOf;
/**
 * Checks is property value is array have n of X values
 */
function arrayDeepStrictUnique(printVal) {
    if (printVal === void 0) { printVal = null; }
    return function (propName, propLabel, propVal) {
        if (!Array.isArray(propVal)) {
            return ["Property " + propLabel + " should be array, gets "
                    + (typeof propVal)];
        }
        var filtered = propVal.reduce(function (acc, el) {
            if (acc !== undefined) {
                return acc;
            }
            var filterFn = (typeof el === "object")
                ? (function (v) { return (0, util_1.isDeepStrictEqual)(v, el); })
                : (function (v) { return v === el; });
            return propVal.filter(filterFn)[1];
        }, undefined);
        return (filtered === undefined)
            ? []
            : [propLabel + " should be array of unique values. Found not unique element"
                    + ((printVal === null) ? "" : (": " + printVal(filtered)))];
    };
}
exports.arrayDeepStrictUnique = arrayDeepStrictUnique;
/**
 * Checks array count by function
 */
function arrayCount(countCheckFn) {
    return function (propName, propLabel, propVal) {
        if (!Array.isArray(propVal)) {
            return ["Property " + propLabel + " should be array, gets "
                    + (typeof propVal)];
        }
        var arrayCount = propVal.length;
        return (countCheckFn(arrayCount))
            ? []
            : [propLabel + " contains array invalid count of items: " + arrayCount];
    };
}
exports.arrayCount = arrayCount;
/**
 * Checks property is a tuple match tuple of validators
 */
function arrayTuple(valids) {
    return function (propName, propLabel, propVal) {
        if (!Array.isArray(propVal)) {
            return ["Property " + propLabel + " should be array, gets "
                    + (typeof propVal)];
        }
        return valids.reduce(function (acc, el, i) {
            return acc.concat(el(propName, "item of " + propLabel, propVal[i]));
        }, [])
            .map(function (err) { return "In property A tuple: " + err; });
    };
}
exports.arrayTuple = arrayTuple;
/**
 * Return errors if one of validators are return errors
 */
function and(valids) {
    return function (propName, propLabel, propVal) {
        return valids.reduce(function (acc, el) {
            return el(propName, propLabel, propVal);
        }, []);
    };
}
exports.and = and;
/**
* Return errors if everyone of validators are return errors
*/
function or(valids) {
    return function (propName, propLabel, propVal) {
        var validResult = valids.map(function (v) {
            return v(propName, propLabel, propVal);
        });
        return (validResult.findIndex(function (errs) { return errs.length === 0; }) === -1)
            ? validResult.reduce(function (acc, el) { return acc.concat(el); }, [])
            : [];
    };
}
exports.or = or;
/**
 * Return errors if everyone of validators are return errors
 */
function not(valid) {
    return function (propName, propLabel, propVal) {
        var validResult = valid(propName, propLabel, propVal);
        return (validResult.length === 0)
            ? ["Value allows condition, thats should not"]
            : [];
    };
}
exports.not = not;
