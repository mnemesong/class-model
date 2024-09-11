import { describe, it } from "mocha"
import * as assert from "assert"
import { __classModelPropertiesKey, getAllPropertiesLabels, getPropertyLabel } from "../src/utils"
import { property, loadData, validationErrors } from "../src"

function strNotEmpty(prop: string, label: string, val: any) {
    return (val.length > 0)
            ? []
            : ([label + " should be grater then 0"])
}

class UserAuth {
    @property("Login", strNotEmpty)
    login: string

    @property("Password", strNotEmpty)
    pass: string
}

describe("uniterable", () => {
    it("test", () => {
        const user = new UserAuth()
        assert.strictEqual(Object.keys(user).includes(__classModelPropertiesKey), false)
    })
})

describe("loading", () => {
    it("valid", () => {
        const user = new UserAuth()
        const loadResult = loadData(user, {login: "asdsa", pass: "c412", koka :12})
        assert.strictEqual(loadResult, true)
        assert.strictEqual(user.login, "asdsa")
        assert.strictEqual(user.pass, "c412")
        assert.strictEqual(user["koka"], undefined)
    })

    it("invalid", () => {
        const user = new UserAuth()
        const loadResult = loadData(user, 15)
        assert.strictEqual(loadResult, false)
    })
})

describe("validation", () => {
    it("valid", () => {
        const user = new UserAuth()
        user.login = "xad12"
        user.pass = "c142s"
        assert.strictEqual(validationErrors(user).length, 0)
    })

    it("invalid", () => {
        const user = new UserAuth()
        user.login = "xad12"
        user.pass = ""
        assert.strictEqual(validationErrors(user).length, 1)
        assert.strictEqual(validationErrors(user)[0], "Password should be grater then 0")
    })
})

describe("labels", () => {
    it("valid", () => {
        const user = new UserAuth()
        user.login = "xad12"
        user.pass = "c142s"
        assert.strictEqual(getPropertyLabel(user, "login"), "Login")
        assert.deepStrictEqual(getAllPropertiesLabels(user), {
            login: "Login",
            pass: "Password"
        })
    })

    it("invalid", () => {
        const user = new UserAuth()
        user.login = "xad12"
        user.pass = "c142s"
        assert.strictEqual(getPropertyLabel(user, "name"), "name")
    })
})