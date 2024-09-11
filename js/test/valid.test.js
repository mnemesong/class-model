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
        (0, src_1.property)("A", valid.strictEqual("12"))
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
        (0, src_1.property)("A", valid.strictDeepEqual({ b: "asd" }, function (v) { return JSON.stringify(v); }))
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
            "A should be equals to {\"b\":\"asd\"}, but actual it is \"12\""
        ]);
    });
});
var RequiredCheckClass = /** @class */ (function () {
    function RequiredCheckClass() {
    }
    __decorate([
        (0, src_1.property)("A", valid.required())
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
        (0, src_1.property)("A", valid.empty())
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
        (0, src_1.property)("A", valid.oneOf(["Rick", "Morty"], function (v) { return JSON.stringify(v); }))
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
            "A should be one of [\"Rick\", \"Morty\"], but actual it is \"42\""
        ]);
    });
});
var ScalarCheckClass = /** @class */ (function () {
    function ScalarCheckClass() {
    }
    __decorate([
        (0, src_1.property)("A", valid.scalar())
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
        (0, src_1.property)("A", valid.arrayOf(valid.strictEqual("aaa")))
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
var ArrayDeepStrictUniqueCheckClass = /** @class */ (function () {
    function ArrayDeepStrictUniqueCheckClass() {
    }
    __decorate([
        (0, src_1.property)("A", valid.arrayDeepStrictUnique(function (v) { return JSON.stringify(v); }))
    ], ArrayDeepStrictUniqueCheckClass.prototype, "a", void 0);
    return ArrayDeepStrictUniqueCheckClass;
}());
(0, mocha_1.describe)("arrayDeepStrictUnique", function () {
    (0, mocha_1.it)("valid", function () {
        var obj = new ArrayDeepStrictUniqueCheckClass();
        obj.a = ["!!!!!", 42, [], 15];
        var validErrors = (0, src_1.validationErrors)(obj);
        assert_1.default.deepStrictEqual(validErrors, []);
    });
    (0, mocha_1.it)("invalid", function () {
        var obj = new ArrayDeepStrictUniqueCheckClass();
        obj.a = ["!!!!!", 42, [], []];
        var validErrors = (0, src_1.validationErrors)(obj);
        assert_1.default.deepStrictEqual(validErrors, [
            "A should be array of unique values. Found not unique element: []"
        ]);
    });
});
var ArrayCountCheckClass = /** @class */ (function () {
    function ArrayCountCheckClass() {
    }
    __decorate([
        (0, src_1.property)("A", valid.arrayCount(function (n) { return n === 3; }))
    ], ArrayCountCheckClass.prototype, "a", void 0);
    return ArrayCountCheckClass;
}());
(0, mocha_1.describe)("arrayCount", function () {
    (0, mocha_1.it)("valid", function () {
        var obj = new ArrayCountCheckClass();
        obj.a = ["!!!!!", 42, []];
        var validErrors = (0, src_1.validationErrors)(obj);
        assert_1.default.deepStrictEqual(validErrors, []);
    });
    (0, mocha_1.it)("invalid", function () {
        var obj = new ArrayCountCheckClass();
        obj.a = ["!!!!!", 42, [], []];
        var validErrors = (0, src_1.validationErrors)(obj);
        assert_1.default.deepStrictEqual(validErrors, [
            "A contains array invalid count of items: 4"
        ]);
    });
});
var ArrayTupleCheckClass = /** @class */ (function () {
    function ArrayTupleCheckClass() {
    }
    __decorate([
        (0, src_1.property)("A", valid.arrayTuple([
            valid.strictDeepEqual(12),
            valid.scalar()
        ]))
    ], ArrayTupleCheckClass.prototype, "a", void 0);
    return ArrayTupleCheckClass;
}());
(0, mocha_1.describe)("arrayTuple", function () {
    (0, mocha_1.it)("valid", function () {
        var obj = new ArrayTupleCheckClass();
        obj.a = [12, Symbol("my symbol")];
        var validErrors = (0, src_1.validationErrors)(obj);
        assert_1.default.deepStrictEqual(validErrors, []);
    });
    (0, mocha_1.it)("invalid", function () {
        var obj = new ArrayTupleCheckClass();
        obj.a = [12, {}];
        var validErrors = (0, src_1.validationErrors)(obj);
        assert_1.default.deepStrictEqual(validErrors, [
            "In property A tuple: item of A should be scalar, but it instance of object:Object"
        ]);
    });
});
var AndCheckClass = /** @class */ (function () {
    function AndCheckClass() {
    }
    __decorate([
        (0, src_1.property)("A", valid.and([
            valid.scalar(),
            valid.strictDeepEqual(12, function (v) { return JSON.stringify(v); }),
        ]))
    ], AndCheckClass.prototype, "a", void 0);
    return AndCheckClass;
}());
(0, mocha_1.describe)("and", function () {
    (0, mocha_1.it)("valid", function () {
        var obj = new AndCheckClass();
        obj.a = 12;
        var validErrors = (0, src_1.validationErrors)(obj);
        assert_1.default.deepStrictEqual(validErrors, []);
    });
    (0, mocha_1.it)("invalid", function () {
        var obj = new AndCheckClass();
        obj.a = "12";
        var validErrors = (0, src_1.validationErrors)(obj);
        assert_1.default.deepStrictEqual(validErrors, [
            "A should be equals to 12, but actual it is \"12\""
        ]);
    });
});
var OrCheckClass = /** @class */ (function () {
    function OrCheckClass() {
    }
    __decorate([
        (0, src_1.property)("A", valid.or([
            valid.strictEqual("twelve"),
            valid.strictDeepEqual(12),
        ]))
    ], OrCheckClass.prototype, "a", void 0);
    return OrCheckClass;
}());
(0, mocha_1.describe)("or", function () {
    (0, mocha_1.it)("valid", function () {
        var obj = new OrCheckClass();
        obj.a = 12;
        var validErrors = (0, src_1.validationErrors)(obj);
        assert_1.default.deepStrictEqual(validErrors, []);
    });
    (0, mocha_1.it)("invalid", function () {
        var obj = new OrCheckClass();
        obj.a = "12";
        var validErrors = (0, src_1.validationErrors)(obj);
        assert_1.default.deepStrictEqual(validErrors, [
            "A should be equals to \"twelve\"",
            "A should be equals to special value",
        ]);
    });
});
var NotCheckClass = /** @class */ (function () {
    function NotCheckClass() {
    }
    __decorate([
        (0, src_1.property)("A", valid.not(valid.strictEqual("twelve")))
    ], NotCheckClass.prototype, "a", void 0);
    return NotCheckClass;
}());
(0, mocha_1.describe)("not", function () {
    (0, mocha_1.it)("valid", function () {
        var obj = new NotCheckClass();
        obj.a = 12;
        var validErrors = (0, src_1.validationErrors)(obj);
        assert_1.default.deepStrictEqual(validErrors, []);
    });
    (0, mocha_1.it)("invalid", function () {
        var obj = new NotCheckClass();
        obj.a = "twelve";
        var validErrors = (0, src_1.validationErrors)(obj);
        assert_1.default.deepStrictEqual(validErrors, [
            "Value allows condition, thats should not"
        ]);
    });
});
var DateCheckClass = /** @class */ (function () {
    function DateCheckClass() {
    }
    __decorate([
        (0, src_1.property)("A", valid.date(function (d) { return (d.getFullYear() === 2022); }))
    ], DateCheckClass.prototype, "a", void 0);
    return DateCheckClass;
}());
(0, mocha_1.describe)("date", function () {
    (0, mocha_1.it)("valid", function () {
        var obj = new DateCheckClass();
        obj.a = new Date("2022-11-11");
        var validErrors = (0, src_1.validationErrors)(obj);
        assert_1.default.deepStrictEqual(validErrors, []);
    });
    (0, mocha_1.it)("invalid 1", function () {
        var obj = new DateCheckClass();
        obj.a = "a";
        var validErrors = (0, src_1.validationErrors)(obj);
        assert_1.default.deepStrictEqual(validErrors, [
            "Property A is not a Date"
        ]);
    });
    (0, mocha_1.it)("invalid 2", function () {
        var obj = new DateCheckClass();
        obj.a = "2022-11-11";
        var validErrors = (0, src_1.validationErrors)(obj);
        assert_1.default.deepStrictEqual(validErrors, [
            "Property A is not a Date"
        ]);
    });
    (0, mocha_1.it)("invalid 3", function () {
        var obj = new DateCheckClass();
        obj.a = new Date("2021-01-01");
        var validErrors = (0, src_1.validationErrors)(obj);
        assert_1.default.deepStrictEqual(validErrors, [
            "Invalid date value Fri Jan 01 2021"
        ]);
    });
});
