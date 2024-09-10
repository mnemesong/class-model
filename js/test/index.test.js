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
var src_1 = require("../src");
function strNotEmpty(prop, label, model) {
    return (model[prop].length > 0)
        ? []
        : ([label + " should be grater then 0"]);
}
var UserAuth = /** @class */ (function () {
    function UserAuth() {
    }
    __decorate([
        (0, src_1.property)("Login", [strNotEmpty])
    ], UserAuth.prototype, "login", void 0);
    __decorate([
        (0, src_1.property)("Password", [strNotEmpty])
    ], UserAuth.prototype, "pass", void 0);
    return UserAuth;
}());
(0, mocha_1.describe)("loading", function () {
    (0, mocha_1.it)("valid", function () {
        var user = new UserAuth();
        var loadResult = (0, src_1.loadData)(user, { login: "asdsa", pass: "c412", koka: 12 });
        assert.strictEqual(loadResult, true);
        assert.strictEqual(user.login, "asdsa");
        assert.strictEqual(user.pass, "c412");
        assert.strictEqual(user["koka"], undefined);
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
        assert.strictEqual((0, src_1.getPropertyLabel)(user, "login"), "Login");
        assert.deepStrictEqual((0, src_1.getAllPropertiesLabels)(user), {
            login: "Login",
            pass: "Password"
        });
    });
    (0, mocha_1.it)("invalid", function () {
        var user = new UserAuth();
        user.login = "xad12";
        user.pass = "c142s";
        assert.strictEqual((0, src_1.getPropertyLabel)(user, "name"), "name");
    });
});
