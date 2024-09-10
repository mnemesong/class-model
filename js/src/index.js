"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationErrors = exports.loadData = exports.property = exports.utils = void 0;
exports.utils = __importStar(require("./utils"));
var utils = __importStar(require("./utils"));
/**
 * Decorator factory for defining property
 */
function property(label, validators, specialConstructor) {
    if (label === void 0) { label = null; }
    if (specialConstructor === void 0) { specialConstructor = null; }
    return function (target, propKey) {
        utils.setProperty(target, propKey, label, validators, specialConstructor);
    };
}
exports.property = property;
/**
 * Load data from object to model by all registered properties
 * Returns true if loading had been successfull, false else
 */
function loadData(model, data) {
    if (typeof data !== "object") {
        return false;
    }
    var oldVals = {};
    try {
        var meta_1 = utils.getAllPropertiesMeta(model);
        var props = Object.keys(meta_1);
        props.forEach(function (p) {
            oldVals[p] = model[p];
            model[p] = !!meta_1[p].specialConstructor
                ? meta_1[p].specialConstructor(data[p])
                : data[p];
        });
        return true;
    }
    catch (e) {
        Object.keys(oldVals).forEach(function (k) {
            model[k] = oldVals[k];
        });
        return false;
    }
}
exports.loadData = loadData;
/**
 * Validates object by registered validators and returns error messages array
 */
function validationErrors(model) {
    var result = [];
    var propMetas = utils.getAllPropertiesMeta(model);
    Object.keys(propMetas).forEach(function (propName) {
        propMetas[propName].validators.forEach(function (v) {
            result = result.concat(v(propName, utils.getPropertyLabel(model, propName), model));
        });
    });
    return result;
}
exports.validationErrors = validationErrors;
