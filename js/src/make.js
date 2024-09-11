"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.int = exports.float = exports.date = exports.bigInt = exports.modelsArray = exports.model = void 0;
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
function bigInt(printData) {
    if (printData === void 0) { printData = null; }
    return function (data) {
        try {
            return BigInt(data);
        }
        catch (e) {
            throw new Error("Try to parse as a bigint invalid value"
                + (!printData ? "" : (": " + printData(data))));
        }
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
            throw new Error("Try to parse as a Date invalid value"
                + (!printData ? "" : (": " + printData(data))));
        }
        return dataObj;
    };
}
exports.date = date;
/**
 * Parse data as a Float
 */
function float(printData) {
    if (printData === void 0) { printData = null; }
    return function (data) {
        var number = NaN;
        switch (typeof data) {
            case "number":
                number = data;
                break;
            case "bigint":
            case "boolean":
                number = (Number(data));
                break;
            case "string":
                parseFloat(data);
                break;
        }
        if (isNaN(number)) {
            throw new Error("Try to parse as a float invalid value"
                + (!printData ? "" : (": " + printData(data))));
        }
        return number;
    };
}
exports.float = float;
/**
 * Parse data as a Float
 */
function int(printData, roundStrategy) {
    if (printData === void 0) { printData = null; }
    if (roundStrategy === void 0) { roundStrategy = "round"; }
    return function (data) {
        var round = (roundStrategy === "round")
            ? Math.round
            : ((roundStrategy === "ceil")
                ? Math.ceil
                : Math.floor);
        var number = NaN;
        switch (typeof data) {
            case "number":
                number = round(data);
                break;
            case "bigint":
            case "boolean":
                number = (round(Number(data)));
                break;
            case "string":
                number = parseInt(data);
                break;
        }
        if (isNaN(number)) {
            throw new Error("Try to parse as a int invalid value"
                + (!printData ? "" : (": " + printData(data))));
        }
        return number;
    };
}
exports.int = int;
