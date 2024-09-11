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
var make_1 = require("../src/make");
var src_1 = require("../src");
var assert_1 = __importDefault(require("assert"));
var SubModel = /** @class */ (function () {
    function SubModel() {
        this.a = 12;
    }
    __decorate([
        (0, src_1.property)("A")
    ], SubModel.prototype, "a", void 0);
    return SubModel;
}());
var MakeModelTestClass = /** @class */ (function () {
    function MakeModelTestClass() {
    }
    __decorate([
        (0, src_1.property)("As", null, (0, make_1.model)(function () { return new SubModel(); }))
    ], MakeModelTestClass.prototype, "as", void 0);
    return MakeModelTestClass;
}());
(0, mocha_1.describe)("make Model", function () {
    (0, mocha_1.it)("valid", function () {
        var obj = new MakeModelTestClass();
        var data = { as: { a: 15 } };
        var loadResult = (0, src_1.loadData)(obj, data);
        assert_1.default.strictEqual(loadResult, true);
        assert_1.default.strictEqual(obj.as.a, 15);
    });
    (0, mocha_1.it)("invalid 1", function () {
        var obj = new MakeModelTestClass();
        var data = { as: 17 };
        var loadResult = (0, src_1.loadData)(obj, data);
        assert_1.default.strictEqual(loadResult, false);
        assert_1.default.strictEqual(obj.as, undefined);
    });
    (0, mocha_1.it)("invalid 2", function () {
        var obj = new MakeModelTestClass();
        var data = "dasfsa";
        var loadResult = (0, src_1.loadData)(obj, data);
        assert_1.default.strictEqual(loadResult, false);
        assert_1.default.strictEqual(obj.as, undefined);
    });
});
var MakeModelsArrayTestClass = /** @class */ (function () {
    function MakeModelsArrayTestClass() {
    }
    __decorate([
        (0, src_1.property)("As", src_1.valid.any(), (0, make_1.modelsArray)(function () { return new SubModel(); }))
    ], MakeModelsArrayTestClass.prototype, "as", void 0);
    return MakeModelsArrayTestClass;
}());
(0, mocha_1.describe)("make ModelsArray", function () {
    (0, mocha_1.it)("valid", function () {
        var obj = new MakeModelsArrayTestClass();
        var data = { as: [{ a: 15 }, { a: 12 }, { a: "asd" }] };
        var loadResult = (0, src_1.loadData)(obj, data);
        assert_1.default.strictEqual(loadResult, true);
        assert_1.default.strictEqual(obj.as[0].a, 15);
        assert_1.default.strictEqual(obj.as[1].a, 12);
        assert_1.default.strictEqual(obj.as[2].a, "asd");
    });
    (0, mocha_1.it)("invalid 1", function () {
        var obj = new MakeModelsArrayTestClass();
        var data = { as: 17 };
        var loadResult = (0, src_1.loadData)(obj, data);
        assert_1.default.strictEqual(loadResult, false);
        assert_1.default.strictEqual(obj.as, undefined);
    });
    (0, mocha_1.it)("invalid 2", function () {
        var obj = new MakeModelsArrayTestClass();
        var data = "dasfsa";
        var loadResult = (0, src_1.loadData)(obj, data);
        assert_1.default.strictEqual(loadResult, false);
        assert_1.default.strictEqual(obj.as, undefined);
    });
});
var MakeDateTestClass = /** @class */ (function () {
    function MakeDateTestClass() {
    }
    __decorate([
        (0, src_1.property)("As", src_1.valid.any(), (0, make_1.date)())
    ], MakeDateTestClass.prototype, "a", void 0);
    return MakeDateTestClass;
}());
(0, mocha_1.describe)("make Date", function () {
    (0, mocha_1.it)("valid 1", function () {
        var obj = new MakeDateTestClass();
        var data = { a: "2022-11-11" };
        var loadResult = (0, src_1.loadData)(obj, data);
        assert_1.default.strictEqual(loadResult, true);
        assert_1.default.strictEqual(obj.a.getFullYear(), 2022);
    });
    (0, mocha_1.it)("valid 2", function () {
        var obj = new MakeDateTestClass();
        var data = { a: new Date("2022-11-11") };
        var loadResult = (0, src_1.loadData)(obj, data);
        assert_1.default.strictEqual(loadResult, true);
        assert_1.default.strictEqual(obj.a.getFullYear(), 2022);
    });
    (0, mocha_1.it)("invalid", function () {
        var obj = new MakeDateTestClass;
        var data = { as: "a" };
        var loadResult = (0, src_1.loadData)(obj, data);
        assert_1.default.strictEqual(loadResult, false);
        assert_1.default.strictEqual(obj.a, undefined);
    });
});
