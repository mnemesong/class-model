"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertByValidator = exports.getMaybeMakeModelFn = exports.getPropertyValidator = exports.getPropertyLabel = exports.getProperties = exports.getAllPropertiesMeta = exports.getAllPropertiesLabels = exports.getPropertyMeta = exports.setProperty = exports.__classModelPropertiesKey = void 0;
exports.__classModelPropertiesKey = "__classModelProperties";
/**
 * Sets property to model
 */
function setProperty(model, propName, label, validator, makeModel) {
    if (label === void 0) { label = null; }
    if (validator === void 0) { validator = null; }
    if (makeModel === void 0) { makeModel = null; }
    if (!model[exports.__classModelPropertiesKey]) {
        Object.defineProperty(model, exports.__classModelPropertiesKey, {
            value: {},
            writable: true,
        });
    }
    model[exports.__classModelPropertiesKey][propName] = {
        validator: validator,
        label: label,
        makeModel: makeModel,
    };
}
exports.setProperty = setProperty;
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
function getPropertyValidator(model, propName) {
    var propMeta = getPropertyMeta(model, propName);
    return (!propMeta || !propMeta["validator"])
        ? null
        : propMeta["validator"];
}
exports.getPropertyValidator = getPropertyValidator;
/**
 * Returns special constructor of property, is it exists
 */
function getMaybeMakeModelFn(model, propName) {
    var propMeta = getPropertyMeta(model, propName);
    return (!propMeta || !propMeta.makeModel)
        ? null
        : propMeta.makeModel;
}
exports.getMaybeMakeModelFn = getMaybeMakeModelFn;
/**
 * assert anonimous value by validator
 */
function assertByValidator(val, validator) {
    var result = validator("", "(anonimous value)", val);
    if (result.length > 0) {
        throw new Error(result[0]);
    }
}
exports.assertByValidator = assertByValidator;
