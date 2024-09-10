"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadData = exports.validationErrors = exports.getPropertyValidators = exports.getPropertyLabel = exports.getProperties = exports.property = exports.getAllPropertiesMeta = exports.getAllPropertiesLabels = exports.getPropertyMeta = exports.__classModelPropertiesKey = void 0;
exports.__classModelPropertiesKey = "__classModelProperties";
/**
 * Sets property to model
 */
function setProperty(_class, propName, label, validators) {
    if (label === void 0) { label = null; }
    if (validators === void 0) { validators = []; }
    if (!_class[exports.__classModelPropertiesKey]) {
        Object.defineProperty(_class, exports.__classModelPropertiesKey, {
            value: {},
            writable: true,
        });
    }
    _class[exports.__classModelPropertiesKey][propName] = {
        validators: validators,
        label: label
    };
}
/**
 * Gets meta-structure with validators and label of property
 */
function getPropertyMeta(_class, propName) {
    if (!_class[exports.__classModelPropertiesKey]) {
        return null;
    }
    if (!_class[exports.__classModelPropertiesKey][propName]) {
        return null;
    }
    return _class[exports.__classModelPropertiesKey][propName];
}
exports.getPropertyMeta = getPropertyMeta;
/**
 * Get structure kind of {[registeredProperty]: [labelOfProperty]}
 */
function getAllPropertiesLabels(_class) {
    var meta = getAllPropertiesMeta(_class);
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
function getAllPropertiesMeta(_class) {
    if (!_class[exports.__classModelPropertiesKey] || (typeof _class !== "object")) {
        return {};
    }
    return _class[exports.__classModelPropertiesKey];
}
exports.getAllPropertiesMeta = getAllPropertiesMeta;
/**
 * Decorator factory for defining property
 */
function property(label, validators) {
    if (label === void 0) { label = null; }
    return function (target, propKey) {
        setProperty(target, propKey, label, validators);
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
function getPropertyLabel(_class, propName) {
    var propMeta = getPropertyMeta(_class, propName);
    var label = (!propMeta || !propMeta["label"])
        ? null
        : propMeta["label"];
    return !!label
        ? label
        : propName;
}
exports.getPropertyLabel = getPropertyLabel;
/**
 * Returns all geristered validators of the property
 */
function getPropertyValidators(_class, propName) {
    var propMeta = getPropertyMeta(_class, propName);
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
 * Load data from object to model by all registered properties
 * Returns true if loading had been successfull, false else
 */
function loadData(model, data) {
    if (typeof data !== "object") {
        return false;
    }
    var oldVals = {};
    try {
        var meta = getAllPropertiesMeta(model);
        var props = Object.keys(meta);
        props.forEach(function (p) {
            oldVals[p] = model[p];
            model[p] = data[p];
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
