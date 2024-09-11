"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayOf = exports.scalar = exports.never = exports.any = exports.oneOf = exports.empty = exports.required = exports.strictDeepEqual = exports.strictEqual = void 0;
var util_1 = require("util");
/**
 * Strict not deep equals to scalar val
 */
function strictEqual(val, printActualVal) {
    if (printActualVal === void 0) { printActualVal = false; }
    return function (propName, propLabel, propVal) {
        return (propVal === val)
            ? []
            : [propLabel + " should be equals to " + JSON.stringify(val)
                    + (printActualVal
                        ? (" but actual it is " + JSON.stringify(propVal))
                        : "")];
    };
}
exports.strictEqual = strictEqual;
/**
 * Deep strict equals validator
 */
function strictDeepEqual(val, printActualVal, serialize) {
    if (printActualVal === void 0) { printActualVal = false; }
    if (serialize === void 0) { serialize = null; }
    if (!serialize) {
        serialize = (function (v) { return JSON.stringify(v); });
    }
    return function (propName, propLabel, propVal) {
        return ((0, util_1.isDeepStrictEqual)(propVal, val))
            ? []
            : [propLabel + " should be equals to " + serialize(val)
                    + (printActualVal
                        ? (" but actual it is " + serialize(propVal))
                        : "")];
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
function oneOf(vals, printActualVal, serialize) {
    if (printActualVal === void 0) { printActualVal = false; }
    if (serialize === void 0) { serialize = null; }
    if (!serialize) {
        serialize = (function (v) { return JSON.stringify(v); });
    }
    return function (propName, propLabel, propVal) {
        return (vals.includes(propVal))
            ? []
            : [propLabel + " should be one of " + JSON.stringify(vals)
                    + (printActualVal
                        ? (" but actual it is " + serialize(propVal))
                        : "")];
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
 * boolean, null or undefined
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
