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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mocha_1 = require("mocha");
var src_1 = require("../src");
var valid = __importStar(require("../src/valid"));
var assert_1 = __importDefault(require("assert"));
var StrictEqualCheckClass = /** @class */ (function () {
    function StrictEqualCheckClass() {
    }
    __decorate([
        (0, src_1.property)("A", [valid.strictEqual("12")])
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
        (0, src_1.property)("A", [valid.strictDeepEqual({ b: "asd" }, true)])
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
var RequiredCheckClass = /** @class */ (function () {
    function RequiredCheckClass() {
    }
    __decorate([
        (0, src_1.property)("A", [valid.required()])
    ], RequiredCheckClass.prototype, "a", void 0);
    return RequiredCheckClass;
}());
(0, mocha_1.describe)("required", function () {
    (0, mocha_1.it)("valid", function () {
        var obj = new RequiredCheckClass();
        obj.a = "12";
        var validErrors = (0, src_1.validationErrors)(obj);
        assert_1.default.deepStrictEqual(validErrors, []);
    });
    (0, mocha_1.it)("invalid", function () {
        var obj = new RequiredCheckClass();
        obj.a = "";
        var validErrors = (0, src_1.validationErrors)(obj);
        assert_1.default.deepStrictEqual(validErrors, [
            "A is required property"
        ]);
    });
});
var EmptyCheckClass = /** @class */ (function () {
    function EmptyCheckClass() {
    }
    __decorate([
        (0, src_1.property)("A", [valid.empty()])
    ], EmptyCheckClass.prototype, "a", void 0);
    return EmptyCheckClass;
}());
(0, mocha_1.describe)("empty", function () {
    (0, mocha_1.it)("valid", function () {
        var obj = new EmptyCheckClass();
        obj.a = "";
        var validErrors = (0, src_1.validationErrors)(obj);
        assert_1.default.deepStrictEqual(validErrors, []);
    });
    (0, mocha_1.it)("invalid", function () {
        var obj = new EmptyCheckClass();
        obj.a = "12";
        var validErrors = (0, src_1.validationErrors)(obj);
        assert_1.default.deepStrictEqual(validErrors, [
            "A should be empty"
        ]);
    });
});
var OneOfCheckClass = /** @class */ (function () {
    function OneOfCheckClass() {
    }
    __decorate([
        (0, src_1.property)("A", [valid.oneOf(["Rick", "Morty"], true)])
    ], OneOfCheckClass.prototype, "a", void 0);
    return OneOfCheckClass;
}());
(0, mocha_1.describe)("oneOf", function () {
    (0, mocha_1.it)("valid", function () {
        var obj = new OneOfCheckClass();
        obj.a = "Morty";
        var validErrors = (0, src_1.validationErrors)(obj);
        assert_1.default.deepStrictEqual(validErrors, []);
    });
    (0, mocha_1.it)("invalid", function () {
        var obj = new OneOfCheckClass();
        obj.a = "42";
        var validErrors = (0, src_1.validationErrors)(obj);
        assert_1.default.deepStrictEqual(validErrors, [
            "A should be one of [\"Rick\",\"Morty\"] but actual it is \"42\""
        ]);
    });
});
var ScalarCheckClass = /** @class */ (function () {
    function ScalarCheckClass() {
    }
    __decorate([
        (0, src_1.property)("A", [valid.scalar()])
    ], ScalarCheckClass.prototype, "a", void 0);
    return ScalarCheckClass;
}());
(0, mocha_1.describe)("scalar", function () {
    (0, mocha_1.it)("valid", function () {
        var obj = new ScalarCheckClass();
        obj.a = "1984";
        var validErrors = (0, src_1.validationErrors)(obj);
        assert_1.default.deepStrictEqual(validErrors, []);
    });
    (0, mocha_1.it)("invalid", function () {
        var obj = new ScalarCheckClass();
        obj.a = [];
        var validErrors = (0, src_1.validationErrors)(obj);
        assert_1.default.deepStrictEqual(validErrors, [
            "A should be scalar, but it instance of object:Array"
        ]);
    });
});
var ArrayOfCheckClass = /** @class */ (function () {
    function ArrayOfCheckClass() {
    }
    __decorate([
        (0, src_1.property)("A", [valid.arrayOf(valid.strictEqual("aaa"))])
    ], ArrayOfCheckClass.prototype, "a", void 0);
    return ArrayOfCheckClass;
}());
(0, mocha_1.describe)("arrayOf", function () {
    (0, mocha_1.it)("valid", function () {
        var obj = new ArrayOfCheckClass();
        obj.a = ["aaa", "aaa", "aaa"];
        var validErrors = (0, src_1.validationErrors)(obj);
        assert_1.default.deepStrictEqual(validErrors, []);
    });
    (0, mocha_1.it)("invalid 1", function () {
        var obj = new ArrayOfCheckClass();
        obj.a = ["aaa", "aaa", "bbb"];
        var validErrors = (0, src_1.validationErrors)(obj);
        assert_1.default.deepStrictEqual(validErrors, [
            "One or more elements in array fail validation:"
                + " item of A should be equals to \"aaa\""
        ]);
    });
    (0, mocha_1.it)("invalid 2", function () {
        var obj = new ArrayOfCheckClass();
        obj.a = "aaa";
        var validErrors = (0, src_1.validationErrors)(obj);
        assert_1.default.deepStrictEqual(validErrors, [
            "Property A should be array, gets string"
        ]);
    });
});
