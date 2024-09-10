"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadData = exports.getMaybeSpecialConstructor = exports.validationErrors = exports.getPropertyValidators = exports.getPropertyLabel = exports.getProperties = exports.property = exports.getAllPropertiesMeta = exports.getAllPropertiesLabels = exports.getPropertyMeta = exports.__classModelPropertiesKey = void 0;
exports.__classModelPropertiesKey = "__classModelProperties";
/**
 * Sets property to model
 */
function setProperty(model, propName, label, validators, specialConstructor) {
    if (label === void 0) { label = null; }
    if (validators === void 0) { validators = []; }
    if (specialConstructor === void 0) { specialConstructor = null; }
    if (!model[exports.__classModelPropertiesKey]) {
        Object.defineProperty(model, exports.__classModelPropertiesKey, {
            value: {},
            writable: true,
        });
    }
    model[exports.__classModelPropertiesKey][propName] = {
        validators: validators,
        label: label,
        specialConstructor: specialConstructor,
    };
}
/**
 * Gets meta-structure with validators and label of property
 */
function getPropertyMeta(model, propName) {
    if (!model[exports.__classModelPropertiesKey]) {
        return null;
    }
    if (!model[exports.__classModelPropertiesKey][propName]) {
        return null;
    }
    return model[exports.__classModelPropertiesKey][propName];
}
exports.getPropertyMeta = getPropertyMeta;
/**
 * Get structure kind of {[registeredProperty]: [labelOfProperty]}
 */
function getAllPropertiesLabels(model) {
    var meta = getAllPropertiesMeta(model);
    var result = {};
    Object.keys(meta).forEach(function (k) {
        result[k] = !!meta[k].label ? meta[k].label : k;
    });
    return result;
}
exports.getAllPropertiesLabels = getAllPropertiesLabels;
/**
 * Gets structure kind of {[registeredProperty]: {label: ..., validators: [...]}}
 */
function getAllPropertiesMeta(model) {
    if (!model[exports.__classModelPropertiesKey] || (typeof model !== "object")) {
        return {};
    }
    return model[exports.__classModelPropertiesKey];
}
exports.getAllPropertiesMeta = getAllPropertiesMeta;
/**
 * Decorator factory for defining property
 */
function property(label, validators, specialConstructor) {
    if (label === void 0) { label = null; }
    if (specialConstructor === void 0) { specialConstructor = null; }
    return function (target, propKey) {
        setProperty(target, propKey, label, validators, specialConstructor);
    };
}
exports.property = property;
/**
 * Get all properties as a string
 */
function getProperties(obj) {
    var meta = getAllPropertiesMeta(obj);
    if (!meta || (typeof meta !== "object")) {
        return [];
    }
    return Object.keys(meta);
}
exports.getProperties = getProperties;
/**
 * Returns label of property or returns property name
 * if special label had not been registered
 */
function getPropertyLabel(model, propName) {
    var propMeta = getPropertyMeta(model, propName);
    var label = (!propMeta || !propMeta["label"])
        ? null
        : propMeta["label"];
    return !!label
        ? label
        : ((typeof propName === "string")
            ? propName
            : propName.toString());
}
exports.getPropertyLabel = getPropertyLabel;
/**
 * Returns all geristered validators of the property
 */
function getPropertyValidators(model, propName) {
    var propMeta = getPropertyMeta(model, propName);
    return (!propMeta || !propMeta["validators"])
        ? []
        : propMeta["validators"];
}
exports.getPropertyValidators = getPropertyValidators;
/**
 * Validates object by registered validators and returns error messages array
 */
function validationErrors(model) {
    var result = [];
    var propMetas = getAllPropertiesMeta(model);
    Object.keys(propMetas).forEach(function (propName) {
        propMetas[propName].validators.forEach(function (v) {
            result = result.concat(v(propName, getPropertyLabel(model, propName), model));
        });
    });
    return result;
}
exports.validationErrors = validationErrors;
/**
 * Returns special constructor of property, is it exists
 */
function getMaybeSpecialConstructor(model, propName) {
    var propMeta = getPropertyMeta(model, propName);
    return (!propMeta || !propMeta.specialConstructor)
        ? null
        : propMeta.specialConstructor;
}
exports.getMaybeSpecialConstructor = getMaybeSpecialConstructor;
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
        var meta_1 = getAllPropertiesMeta(model);
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
