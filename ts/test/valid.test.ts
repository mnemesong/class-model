import { describe, it } from "mocha";
import { property, validationErrors } from "../src";
import * as valid from "../src/valid";
import assert from "assert";

class StrictEqualCheckClass {
    @property("A", [valid.strictEqual("12")])
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
    @property("A", [valid.strictDeepEqual({b: "asd"}, true)])
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

class RequiredCheckClass {
    @property("A", [valid.required()])
    public a: any
}

describe("required", () => {
    it("valid", () => {
        const obj = new RequiredCheckClass()
        obj.a = "12"
        const validErrors = validationErrors(obj)
        assert.deepStrictEqual(validErrors, [])
    })

    it("invalid", () => {
        const obj = new RequiredCheckClass()
        obj.a = ""
        const validErrors = validationErrors(obj)
        assert.deepStrictEqual(validErrors, [
            "A is required property"
        ])
    })
})

class EmptyCheckClass {
    @property("A", [valid.empty()])
    public a: any
}

describe("empty", () => {
    it("valid", () => {
        const obj = new EmptyCheckClass()
        obj.a = ""
        const validErrors = validationErrors(obj)
        assert.deepStrictEqual(validErrors, [])
    })

    it("invalid", () => {
        const obj = new EmptyCheckClass()
        obj.a = "12"
        const validErrors = validationErrors(obj)
        assert.deepStrictEqual(validErrors, [
            "A should be empty"
        ])
    })
})

class OneOfCheckClass {
    @property("A", [valid.oneOf(["Rick", "Morty"], true)])
    public a: any
}

describe("oneOf", () => {
    it("valid", () => {
        const obj = new OneOfCheckClass()
        obj.a = "Morty"
        const validErrors = validationErrors(obj)
        assert.deepStrictEqual(validErrors, [])
    })

    it("invalid", () => {
        const obj = new OneOfCheckClass()
        obj.a = "42"
        const validErrors = validationErrors(obj)
        assert.deepStrictEqual(validErrors, [
            "A should be one of [\"Rick\",\"Morty\"] but actual it is \"42\""
        ])
    })
})

class ScalarCheckClass {
    @property("A", [valid.scalar()])
    public a: any
}

describe("scalar", () => {
    it("valid", () => {
        const obj = new ScalarCheckClass()
        obj.a = "1984"
        const validErrors = validationErrors(obj)
        assert.deepStrictEqual(validErrors, [])
    })

    it("invalid", () => {
        const obj = new ScalarCheckClass()
        obj.a = []
        const validErrors = validationErrors(obj)
        assert.deepStrictEqual(validErrors, [
            "A should be scalar, but it instance of object:Array"
        ])
    })
})

class ArrayOfCheckClass {
    @property("A", [valid.arrayOf(valid.strictEqual("aaa"))])
    public a: any
}

describe("arrayOf", () => {
    it("valid", () => {
        const obj = new ArrayOfCheckClass()
        obj.a = ["aaa", "aaa", "aaa"]
        const validErrors = validationErrors(obj)
        assert.deepStrictEqual(validErrors, [])
    })

    it("invalid 1", () => {
        const obj = new ArrayOfCheckClass()
        obj.a = ["aaa", "aaa", "bbb"]
        const validErrors = validationErrors(obj)
        assert.deepStrictEqual(validErrors, [
            "One or more elements in array fail validation:" 
                + " item of A should be equals to \"aaa\""
        ])
    })

    it("invalid 2", () => {
        const obj = new ArrayOfCheckClass()
        obj.a = "aaa"
        const validErrors = validationErrors(obj)
        assert.deepStrictEqual(validErrors, [
            "Property A should be array, gets string" 
        ])
    })
})