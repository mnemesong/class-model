import { describe, it } from "mocha";
import { model, modelsArray } from "../src/make";
import { loadData, property } from "../src";
import assert from "assert";

class SubModel {
    @property("A", [])
    a: number = 12
}

class MakeModelTestClass {
    @property("As", [], model(() => new SubModel()))
    public as: SubModel
}

describe("make Model", () => {
    it("valid", () => {
        const obj = new MakeModelTestClass()
        const data = {as: {a: 15}}
        const loadResult = loadData(obj, data)
        assert.strictEqual(loadResult, true)
        assert.strictEqual(obj.as.a, 15)
    })

    it("invalid 1", () => {
        const obj = new MakeModelTestClass()
        const data = {as: 17}
        const loadResult = loadData(obj, data)
        assert.strictEqual(loadResult, false)
        assert.strictEqual(obj.as, undefined)
    })

    it("invalid 2", () => {
        const obj = new MakeModelTestClass()
        const data = "dasfsa"
        const loadResult = loadData(obj, data)
        assert.strictEqual(loadResult, false)
        assert.strictEqual(obj.as, undefined)
    })
})

class MakeModelsArrayTestClass {
    @property("As", [], modelsArray(() => new SubModel()))
    public as: SubModel[]
}

describe("make ModelsArray", () => {
    it("valid", () => {
        const obj = new MakeModelsArrayTestClass()
        const data = {as: [{a: 15}, {a: 12}, {a: "asd"}]}
        const loadResult = loadData(obj, data)
        assert.strictEqual(loadResult, true)
        assert.strictEqual(obj.as[0].a, 15)
        assert.strictEqual(obj.as[1].a, 12)
        assert.strictEqual(obj.as[2].a, "asd")
    })

    it("invalid 1", () => {
        const obj = new MakeModelsArrayTestClass()
        const data = {as: 17}
        const loadResult = loadData(obj, data)
        assert.strictEqual(loadResult, false)
        assert.strictEqual(obj.as, undefined)
    })

    it("invalid 2", () => {
        const obj = new MakeModelsArrayTestClass()
        const data = "dasfsa"
        const loadResult = loadData(obj, data)
        assert.strictEqual(loadResult, false)
        assert.strictEqual(obj.as, undefined)
    })
})