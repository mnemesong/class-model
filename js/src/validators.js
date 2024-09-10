"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.strictDeepEquals = exports.strictEquals = void 0;
var util_1 = require("util");
/**
 * Strict not deep equals to scalar val
 */
function strictEquals(val, printActualVal) {
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
exports.strictEquals = strictEquals;
/**
 * Deep strict equals validator
 */
function strictDeepEquals(val, printActualVal, serialize) {
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
exports.strictDeepEquals = strictDeepEquals;
