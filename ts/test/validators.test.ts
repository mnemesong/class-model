import { describe, it } from "mocha";
import { property, validationErrors } from "../src";
import { strictDeepEquals as strictDeepEqual, strictEquals as strictEqual } from "../src/validators";
import assert from "assert";

class StrictEqualCheckClass {
    @property("A", [strictEqual("12")])
    public a: string
}

describe("strictEqual", () => {
    it("valid", () => {
        const obj = new StrictEqualCheckClass()
        obj.a = "12"
        const validErrors = validationErrors(obj)
        assert.deepStrictEqual(validErrors, [])
    })

    it("invalid", () => {
        const obj = new StrictEqualCheckClass()
        obj.a = "11"
        const validErrors = validationErrors(obj)
        assert.deepStrictEqual(validErrors, ["A should be equals to \"12\""])
    })
})


class DeepStrictEqualCheckClass {
    @property("A", [strictDeepEqual({b: "asd"}, true)])
    public a: any
}

describe("deepStrictEqual", () => {
    it("valid", () => {
        const obj = new DeepStrictEqualCheckClass()
        obj.a = {b: "asd"}
        const validErrors = validationErrors(obj)
        assert.deepStrictEqual(validErrors, [])
    })

    it("invalid", () => {
        const obj = new DeepStrictEqualCheckClass()
        obj.a = "12"
        const validErrors = validationErrors(obj)
        assert.deepStrictEqual(validErrors, [
            "A should be equals to {\"b\":\"asd\"} but actual it is \"12\""
        ])
    })
})