import { describe, it } from "mocha"
import * as assert from "assert"
import { __classModelPropertiesKey, getAllPropertiesLabels, getPropertyLabel } from "../src/utils"
import { property, loadData, validationErrors, toStructure, valid, make, assertModel, loadValidAssertArray } from "../src"

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

class SubModel1 {
    @property(null,
        valid.and([
            valid.string(),
            valid.required()
        ])    
    )
    public sm1a: string
}

class SubModel2 {
    @property(null,
        valid.number(),
        make.float()
    )
    public sm2a: number

    @property(null,
        valid.and([
            valid.objInstance(SubModel1),
            valid.objValidModel()
        ]),
        make.model(() => new SubModel1())
    )
    public sm2b: SubModel1
}

class Model3 {
    @property(null,
        valid.arrayOf(valid.and([
            valid.objInstance(SubModel2),
            valid.objValidModel()
        ])),
        make.modelsArray(() => new SubModel2)
    )
    public m1: SubModel2[]

    @property(null,
        valid.required(),
        make.bigInt()    
    )
    public m2: bigint
}

describe("loading", () => {
    it("valid 1", () => {
        const user = new UserAuth()
        const loadResult = loadData(user, {login: "asdsa", pass: "c412", koka :12})
        assert.strictEqual(loadResult, true)
        assert.strictEqual(user.login, "asdsa")
        assert.strictEqual(user.pass, "c412")
        assert.strictEqual(user["koka"], undefined)
    })

    it("valid 2", () => {
        const m3 = new Model3()
        const loadResult = loadData(m3, {
            m2: BigInt(14212),
            m1: [
                {sm2a: "12325.123", sm2b: {sm1a: "aboba"}},
                {sm2a: "-0.5264", sm2b: {sm1a: "11"}},
            ]
        })
        assertModel(m3)
        assert.strictEqual(loadResult, true)
        assert.strictEqual(m3.m2, BigInt(14212))
        assert.strictEqual(m3.m1[0].sm2a, 12325.123)
        assert.strictEqual(m3.m1[1].sm2b.sm1a, "11")
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

describe("toStructure", () => {
    it("valid", () => {
        const user = new UserAuth()
        user.login = "xad12"
        user.pass = "c142s"
        assert.deepStrictEqual(toStructure(user), {
            login: "xad12",
            pass: "c142s"
        })
    })
})

class SimpleUser {
    @property(null,
        valid.boolean(),
        make.boolean()
    )
    public isPremium: boolean
}

describe("toloadValidAssertArray", () => {
    it("valid", () => {
        const simpleUsersData = [
            {isPremium: false},
            {isPremium: 0},
            {isPremium: 1},
            {isPremium: null},
        ]
        const users = loadValidAssertArray(() => new SimpleUser(), simpleUsersData)
        assert.strictEqual(users[0].isPremium, false)
        assert.strictEqual(users[1].isPremium, false)
        assert.strictEqual(users[2].isPremium, true)
        assert.strictEqual(users[3].isPremium, false)
    })
})