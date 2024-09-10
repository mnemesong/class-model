"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mocha_1 = require("mocha");
var src_1 = require("../src");
var validators_1 = require("../src/validators");
var assert_1 = __importDefault(require("assert"));
var StrictEqualCheckClass = /** @class */ (function () {
    function StrictEqualCheckClass() {
    }
    __decorate([
        (0, src_1.property)("A", [(0, validators_1.strictEquals)("12")])
    ], StrictEqualCheckClass.prototype, "a", void 0);
    return StrictEqualCheckClass;
}());
(0, mocha_1.describe)("strictEqual", function () {
    (0, mocha_1.it)("valid", function () {
        var obj = new StrictEqualCheckClass();
        obj.a = "12";
        var validErrors = (0, src_1.validationErrors)(obj);
        assert_1.default.deepStrictEqual(validErrors, []);
    });
    (0, mocha_1.it)("invalid", function () {
        var obj = new StrictEqualCheckClass();
        obj.a = "11";
        var validErrors = (0, src_1.validationErrors)(obj);
        assert_1.default.deepStrictEqual(validErrors, ["A should be equals to \"12\""]);
    });
});
var DeepStrictEqualCheckClass = /** @class */ (function () {
    function DeepStrictEqualCheckClass() {
    }
    __decorate([
        (0, src_1.property)("A", [(0, validators_1.strictDeepEquals)({ b: "asd" }, true)])
    ], DeepStrictEqualCheckClass.prototype, "a", void 0);
    return DeepStrictEqualCheckClass;
}());
(0, mocha_1.describe)("deepStrictEqual", function () {
    (0, mocha_1.it)("valid", function () {
        var obj = new DeepStrictEqualCheckClass();
        obj.a = { b: "asd" };
        var validErrors = (0, src_1.validationErrors)(obj);
        assert_1.default.deepStrictEqual(validErrors, []);
    });
    (0, mocha_1.it)("invalid", function () {
        var obj = new DeepStrictEqualCheckClass();
        obj.a = "12";
        var validErrors = (0, src_1.validationErrors)(obj);
        assert_1.default.deepStrictEqual(validErrors, [
            "A should be equals to {\"b\":\"asd\"} but actual it is \"12\""
        ]);
    });
});
