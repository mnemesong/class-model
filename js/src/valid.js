"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oneOf = exports.empty = exports.required = exports.strictDeepEqual = exports.strictEqual = void 0;
var util_1 = require("util");
/**
 * Strict not deep equals to scalar val
 */
function strictEqual(val, printActualVal) {
    if (printActualVal === void 0) { printActualVal = false; }
    return function (propName, propLabel, model) {
        return (model[propName] === val)
            ? []
            : [propLabel + " should be equals to " + JSON.stringify(val)
                    + (printActualVal
                        ? (" but actual it is " + JSON.stringify(model[propName]))
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
    return function (propName, propLabel, model) {
        return ((0, util_1.isDeepStrictEqual)(model[propName], val))
            ? []
            : [propLabel + " should be equals to " + serialize(val)
                    + (printActualVal
                        ? (" but actual it is " + serialize(model[propName]))
                        : "")];
    };
}
exports.strictDeepEqual = strictDeepEqual;
/**
 * Value satisfies operator !!val
 */
function required() {
    return function (propName, propLabel, model) {
        return (!model[propName])
            ? [propLabel + " is required property"]
            : [];
    };
}
exports.required = required;
/**
 * Value satisfies operator !val
 */
function empty() {
    return function (propName, propLabel, model) {
        return (!model[propName])
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
    return function (propName, propLabel, model) {
        return (vals.includes(model[propName]))
            ? []
            : [propLabel + " should be one of " + JSON.stringify(vals)
                    + (printActualVal
                        ? (" but actual it is " + serialize(model[propName]))
                        : "")];
    };
}
exports.oneOf = oneOf;
