"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadData = exports.validationErrors = exports.getPropertyValidators = exports.getPropertyLabel = exports.clearAllValidators = exports.addValidators = exports.property = exports.getAllPropertiesMeta = exports.getAllPropertiesLabels = exports.getPropertyMeta = exports.__classModelPropertiesKey = void 0;
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
function addValidators(_class, propName, validators) {
    var propMeta = getPropertyMeta(_class, propName);
    if (!propMeta) {
        setProperty(_class, propName, null, validators);
        return;
    }
    setProperty(_class, propName, propMeta.label, propMeta.validators.concat(validators));
}
exports.addValidators = addValidators;
function clearAllValidators(_class) {
    if (!_class[exports.__classModelPropertiesKey]) {
        return;
    }
    Object.keys(_class[exports.__classModelPropertiesKey])
        .forEach(function (key) {
        _class[exports.__classModelPropertiesKey][key].validators = [];
    });
}
exports.clearAllValidators = clearAllValidators;
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
function getPropertyValidators(_class, propName) {
    var propMeta = getPropertyMeta(_class, propName);
    return (!propMeta || !propMeta[propName] || !propMeta[propName]["validators"])
        ? []
        : propMeta[propName]["validators"];
}
exports.getPropertyValidators = getPropertyValidators;
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
