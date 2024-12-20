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
Object.defineProperty(exports, "__esModule", { value: true });
var mocha_1 = require("mocha");
var assert = __importStar(require("assert"));
var utils_1 = require("../src/utils");
var src_1 = require("../src");
function strNotEmpty(prop, label, val) {
    return (val.length > 0)
        ? []
        : ([label + " should be grater then 0"]);
}
var UserAuth = /** @class */ (function () {
    function UserAuth() {
    }
    __decorate([
        (0, src_1.property)("Login", strNotEmpty)
    ], UserAuth.prototype, "login", void 0);
    __decorate([
        (0, src_1.property)("Password", strNotEmpty)
    ], UserAuth.prototype, "pass", void 0);
    return UserAuth;
}());
(0, mocha_1.describe)("uniterable", function () {
    (0, mocha_1.it)("test", function () {
        var user = new UserAuth();
        assert.strictEqual(Object.keys(user).includes(utils_1.__classModelPropertiesKey), false);
    });
});
var SubModel1 = /** @class */ (function () {
    function SubModel1() {
    }
    __decorate([
        (0, src_1.property)(null, src_1.valid.and([
            src_1.valid.string(),
            src_1.valid.required()
        ]))
    ], SubModel1.prototype, "sm1a", void 0);
    return SubModel1;
}());
var SubModel2 = /** @class */ (function () {
    function SubModel2() {
    }
    __decorate([
        (0, src_1.property)(null, src_1.valid.number(), src_1.make.float())
    ], SubModel2.prototype, "sm2a", void 0);
    __decorate([
        (0, src_1.property)(null, src_1.valid.and([
            src_1.valid.objInstance(SubModel1),
            src_1.valid.objValidModel()
        ]), src_1.make.model(function () { return new SubModel1(); }))
    ], SubModel2.prototype, "sm2b", void 0);
    return SubModel2;
}());
var Model3 = /** @class */ (function () {
    function Model3() {
    }
    __decorate([
        (0, src_1.property)(null, src_1.valid.arrayOf(src_1.valid.and([
            src_1.valid.objInstance(SubModel2),
            src_1.valid.objValidModel()
        ])), src_1.make.modelsArray(function () { return new SubModel2; }))
    ], Model3.prototype, "m1", void 0);
    __decorate([
        (0, src_1.property)(null, src_1.valid.required(), src_1.make.bigInt())
    ], Model3.prototype, "m2", void 0);
    return Model3;
}());
(0, mocha_1.describe)("loading", function () {
    (0, mocha_1.it)("valid 1", function () {
        var user = new UserAuth();
        var loadResult = (0, src_1.loadData)(user, { login: "asdsa", pass: "c412", koka: 12 });
        assert.strictEqual(loadResult, true);
        assert.strictEqual(user.login, "asdsa");
        assert.strictEqual(user.pass, "c412");
        assert.strictEqual(user["koka"], undefined);
    });
    (0, mocha_1.it)("valid 2", function () {
        var m3 = new Model3();
        var loadResult = (0, src_1.loadData)(m3, {
            m2: BigInt(14212),
            m1: [
                { sm2a: "12325.123", sm2b: { sm1a: "aboba" } },
                { sm2a: "-0.5264", sm2b: { sm1a: "11" } },
            ]
        });
        (0, src_1.assertModel)(m3);
        assert.strictEqual(loadResult, true);
        assert.strictEqual(m3.m2, BigInt(14212));
        assert.strictEqual(m3.m1[0].sm2a, 12325.123);
        assert.strictEqual(m3.m1[1].sm2b.sm1a, "11");
    });
    (0, mocha_1.it)("invalid", function () {
        var user = new UserAuth();
        var loadResult = (0, src_1.loadData)(user, 15);
        assert.strictEqual(loadResult, false);
    });
});
(0, mocha_1.describe)("validation", function () {
    (0, mocha_1.it)("valid", function () {
        var user = new UserAuth();
        user.login = "xad12";
        user.pass = "c142s";
        assert.strictEqual((0, src_1.validationErrors)(user).length, 0);
    });
    (0, mocha_1.it)("invalid", function () {
        var user = new UserAuth();
        user.login = "xad12";
        user.pass = "";
        assert.strictEqual((0, src_1.validationErrors)(user).length, 1);
        assert.strictEqual((0, src_1.validationErrors)(user)[0], "Password should be grater then 0");
    });
});
(0, mocha_1.describe)("labels", function () {
    (0, mocha_1.it)("valid", function () {
        var user = new UserAuth();
        user.login = "xad12";
        user.pass = "c142s";
        assert.strictEqual((0, utils_1.getPropertyLabel)(user, "login"), "Login");
        assert.deepStrictEqual((0, utils_1.getAllPropertiesLabels)(user), {
            login: "Login",
            pass: "Password"
        });
    });
    (0, mocha_1.it)("invalid", function () {
        var user = new UserAuth();
        user.login = "xad12";
        user.pass = "c142s";
        assert.strictEqual((0, utils_1.getPropertyLabel)(user, "name"), "name");
    });
});
(0, mocha_1.describe)("toStructure", function () {
    (0, mocha_1.it)("valid", function () {
        var user = new UserAuth();
        user.login = "xad12";
        user.pass = "c142s";
        assert.deepStrictEqual((0, src_1.toStructure)(user), {
            login: "xad12",
            pass: "c142s"
        });
    });
});
var SimpleUser = /** @class */ (function () {
    function SimpleUser() {
    }
    __decorate([
        (0, src_1.property)(null, src_1.valid.boolean(), src_1.make.boolean())
    ], SimpleUser.prototype, "isPremium", void 0);
    return SimpleUser;
}());
(0, mocha_1.describe)("toloadValidAssertArray", function () {
    (0, mocha_1.it)("valid", function () {
        var simpleUsersData = [
            { isPremium: false },
            { isPremium: 0 },
            { isPremium: 1 },
            { isPremium: null },
        ];
        var users = (0, src_1.loadValidAssertArray)(function () { return new SimpleUser(); }, simpleUsersData);
        assert.strictEqual(users[0].isPremium, false);
        assert.strictEqual(users[1].isPremium, false);
        assert.strictEqual(users[2].isPremium, true);
        assert.strictEqual(users[3].isPremium, false);
    });
});
