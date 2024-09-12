"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringRegMatch = exports.stringLength = exports.string = exports.objProps = exports.objHasKeys = exports.objValidModel = exports.objInstance = exports.number = exports.date = exports.not = exports.or = exports.and = exports.arrayTuple = exports.arrayCount = exports.arrayDeepStrictUnique = exports.arrayOf = exports.scalar = exports.never = exports.any = exports.oneOf = exports.filterFn = exports.empty = exports.required = exports.strictDeepEqual = exports.strictEqual = void 0;
var util_1 = require("util");
var _1 = require(".");
var utils_1 = require("./utils");
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
 * Value satisfies filter function
 */
function filterFn(filterFn) {
    return function (propName, propLabel, propVal) {
        return (!filterFn(propVal))
            ? [propLabel + " should match filter function"]
            : [];
    };
}
exports.filterFn = filterFn;
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
    if (itemValidator === void 0) { itemValidator = null; }
    return function (propName, propLabel, propVal) {
        if (!Array.isArray(propVal)) {
            return ["Property " + propLabel + " should be array, gets "
                    + (typeof propVal)];
        }
        if (!itemValidator) {
            return [];
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
    if (countCheckFn === void 0) { countCheckFn = null; }
    return function (propName, propLabel, propVal) {
        if (!Array.isArray(propVal)) {
            return ["Property " + propLabel + " should be array, gets "
                    + (typeof propVal)];
        }
        if (!countCheckFn) {
            return [];
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
    if (valids === void 0) { valids = null; }
    return function (propName, propLabel, propVal) {
        if (!Array.isArray(propVal)) {
            return ["Property " + propLabel + " should be array, gets "
                    + (typeof propVal)];
        }
        if (!valids) {
            return [];
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
/**
 * Date validation by lambda
 */
function date(valid) {
    if (valid === void 0) { valid = null; }
    return function (propName, propLabel, propVal) {
        if (!(propVal instanceof Date)) {
            return ["Property " + propLabel + " is not a Date"];
        }
        if (!valid) {
            return [];
        }
        var result = valid(propVal);
        if (typeof result === "boolean") {
            return !result
                ? [propLabel + " is invalid date value " + propVal.toDateString()]
                : [];
        }
        return result;
    };
}
exports.date = date;
/**
 * Validate number by lambda
 */
function number(valid) {
    if (valid === void 0) { valid = null; }
    return function (propName, propLabel, propVal) {
        if (typeof propVal !== "number") {
            return ["Property " + propLabel + " is not a number"];
        }
        if (!valid) {
            return [];
        }
        var result = valid(propVal);
        if (typeof result === "boolean") {
            return !result
                ? [propLabel + " is invalid number value " + JSON.stringify(propVal)]
                : [];
        }
        return result
            .map(function (err) { return "In property " + propLabel + ": " + err; });
    };
}
exports.number = number;
/**
 * Checks object is instance of X
 */
function objInstance(construct) {
    if (construct === void 0) { construct = null; }
    return function (propName, propLabel, propVal) {
        var className = !construct ? "object" : construct.name;
        if (typeof propVal !== "object") {
            return [propLabel + " should be object, gets " + (typeof propVal)];
        }
        if (!construct) {
            return [];
        }
        if (!(propVal instanceof construct)) {
            return [propLabel + " should be instance of " + className
                    + ", gets instance of " + propVal.constructor.name];
        }
        return [];
    };
}
exports.objInstance = objInstance;
/**
 * Checks object is valid as a Model
 */
function objValidModel() {
    return function (propName, propLabel, propVal) {
        if (typeof propVal !== "object") {
            return [propLabel + " should be object, gets " + (typeof propVal)];
        }
        return (0, _1.validationErrors)(propVal)
            .map(function (err) { return propLabel + " should be valid Model, but in it: " + err; });
    };
}
exports.objValidModel = objValidModel;
/**
 * Checks object has keys
 */
function objHasKeys(keys) {
    return function (propName, propLabel, propVal) {
        if (typeof propVal !== "object") {
            return [propLabel + " should be object, gets " + (typeof propVal)];
        }
        var objectKeys = Object.getOwnPropertyNames(propVal);
        var objectOwnPropSymbols = Object.getOwnPropertySymbols(propVal);
        return keys.reduce(function (errs, k) {
            return (typeof k === "symbol")
                ? (objectOwnPropSymbols.includes(k)
                    ? errs
                    : errs.concat([propLabel + " should contains key " + k.toString()]))
                : (objectKeys.includes(k)
                    ? errs
                    : errs.concat([propLabel + " should contains key " + k]));
        }, []);
    };
}
exports.objHasKeys = objHasKeys;
/**
 * Checks object values by structure of validators
 */
function objProps(propValidators) {
    return function (propName, propLabel, propVal) {
        if (typeof propVal !== "object") {
            return [propLabel + " should be object, gets " + (typeof propVal)];
        }
        var objectKeys = Object.getOwnPropertyNames(propVal);
        var objectOwnPropSymbols = Object.getOwnPropertySymbols(propVal);
        return Object.getOwnPropertyNames(propValidators)
            .concat(Object.getOwnPropertySymbols(propValidators))
            .reduce(function (errs, k) {
            return errs
                .concat(propValidators[k](k, (0, utils_1.getPropertyLabel)(propVal, k), propVal[k]));
        }, [])
            .map(function (err) { return propLabel + " contains object, checks by property: " + err; });
    };
}
exports.objProps = objProps;
/**
 * Validate string by lambda
 */
function string(valid) {
    if (valid === void 0) { valid = null; }
    return function (propName, propLabel, propVal) {
        if (typeof propVal !== "string") {
            return ["Property " + propLabel + " is not a string"];
        }
        if (!valid) {
            return [];
        }
        var result = valid(propVal);
        if (typeof result === "boolean") {
            return !result
                ? [propLabel + " is invalid string value " + JSON.stringify(propVal)]
                : [];
        }
        return result
            .map(function (err) { return "In property " + propLabel + ": " + err; });
    };
}
exports.string = string;
/**
 * Validate string by lambda
 */
function stringLength(valid) {
    if (valid === void 0) { valid = null; }
    return function (propName, propLabel, propVal) {
        if (typeof propVal !== "string") {
            return ["Property " + propLabel + " is not a string"];
        }
        if (!valid) {
            return [];
        }
        var result = valid(propVal.length);
        if (typeof result === "boolean") {
            return !result
                ? [propLabel + " is invalid length of string value " + JSON.stringify(propVal)]
                : [];
        }
        return result
            .map(function (err) { return "In property " + propLabel + ": " + err; });
    };
}
exports.stringLength = stringLength;
/**
 * Validate string by lambda
 */
function stringRegMatch(regex) {
    return function (propName, propLabel, propVal) {
        if (typeof propVal !== "string") {
            return ["Property " + propLabel + " is not a string"];
        }
        var result = propVal.match(regex);
        if (!!result && (result.length > 0)) {
            return [];
        }
        return (!!result && (result.length > 0))
            ? []
            : ["In property " + propLabel + " string \"" + propVal
                    + "\" is not metch regular expression "
                    + ((typeof regex === "string") ? regex : regex.toString())];
    };
}
exports.stringRegMatch = stringRegMatch;
