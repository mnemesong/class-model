"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.date = exports.bigInt = exports.modelsArray = exports.model = void 0;
var _1 = require(".");
/**
 * Load model uses getter
 */
function model(getModel) {
    return function (data) {
        if (typeof data !== "object") {
            throw new Error("Cannot load not object data to model");
        }
        var obj = getModel();
        var loaded = (0, _1.loadData)(obj, data);
        if (loaded === false) {
            throw new Error("Error on loading model property");
        }
        return obj;
    };
}
exports.model = model;
/**
 * Load array of models uses getter
 */
function modelsArray(getModel) {
    return function (data) {
        if (!Array.isArray(data)) {
            throw new Error("try to load models array by not array of data");
        }
        var loader = model(getModel);
        return data.map(function (v) { return loader(v); });
    };
}
exports.modelsArray = modelsArray;
/**
 * Load bigint
 */
function bigInt() {
    return function (data) {
        if (!["bigint", "number", "string", "boolean"].includes(typeof data)) {
            throw new Error("Try to construct bigint from invalid data value");
        }
        return BigInt(data);
    };
}
exports.bigInt = bigInt;
/**
 * Constructs Date from loading data
 */
function date(printData) {
    if (printData === void 0) { printData = null; }
    return function (data) {
        var dataObj = (data instanceof Date)
            ? data
            : (new Date(data));
        if (isNaN(dataObj)) {
            throw new Error("Constructs invalid Date from value"
                + (!printData ? "" : (": " + printData(data))));
        }
        return dataObj;
    };
}
exports.date = date;
