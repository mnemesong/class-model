import { describe, it } from "mocha";
import { property, validationErrors } from "../src";
import * as valid from "../src/valid";
import assert from "assert";

class StrictEqualCheckClass {
    @property("A", valid.strictEqual("12"))
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
    @property("A", valid.strictDeepEqual({b: "asd"}, (v) => JSON.stringify(v)))
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
            "A should be equals to {\"b\":\"asd\"}, but actual it is \"12\""
        ])
    })
})

class RequiredCheckClass {
    @property("A", valid.required())
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
    @property("A", valid.empty())
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
    @property("A", valid.oneOf(["Rick", "Morty"], (v) => JSON.stringify(v)))
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
            "A should be one of [\"Rick\", \"Morty\"], but actual it is \"42\""
        ])
    })
})

class ScalarCheckClass {
    @property("A", valid.scalar())
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
    @property("A", valid.arrayOf(valid.strictEqual("aaa")))
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

class ArrayDeepStrictUniqueCheckClass {
    @property("A", valid.arrayDeepStrictUnique((v) => JSON.stringify(v)))
    public a: any
}

describe("arrayDeepStrictUnique", () => {
    it("valid", () => {
        const obj = new ArrayDeepStrictUniqueCheckClass()
        obj.a = ["!!!!!", 42, [], 15]
        const validErrors = validationErrors(obj)
        assert.deepStrictEqual(validErrors, [])
    })

    it("invalid", () => {
        const obj = new ArrayDeepStrictUniqueCheckClass()
        obj.a = ["!!!!!", 42, [], []]
        const validErrors = validationErrors(obj)
        assert.deepStrictEqual(validErrors, [
            "A should be array of unique values. Found not unique element: []"
        ])
    })
})

class ArrayCountCheckClass {
    @property("A", valid.arrayCount((n) => n === 3))
    public a: any
}

describe("arrayCount", () => {
    it("valid", () => {
        const obj = new ArrayCountCheckClass()
        obj.a = ["!!!!!", 42, []]
        const validErrors = validationErrors(obj)
        assert.deepStrictEqual(validErrors, [])
    })

    it("invalid", () => {
        const obj = new ArrayCountCheckClass()
        obj.a = ["!!!!!", 42, [], []]
        const validErrors = validationErrors(obj)
        assert.deepStrictEqual(validErrors, [
            "A contains array invalid count of items: 4"
        ])
    })
})

class ArrayTupleCheckClass {
    @property("A", valid.arrayTuple([
        valid.strictDeepEqual(12),
        valid.scalar()
    ]))
    public a: any
}

describe("arrayTuple", () => {
    it("valid", () => {
        const obj = new ArrayTupleCheckClass()
        obj.a = [12, Symbol("my symbol")]
        const validErrors = validationErrors(obj)
        assert.deepStrictEqual(validErrors, [])
    })

    it("invalid", () => {
        const obj = new ArrayTupleCheckClass()
        obj.a = [12, {}]
        const validErrors = validationErrors(obj)
        assert.deepStrictEqual(validErrors, [
            "In property A tuple: item of A should be scalar, but it instance of object:Object"
        ])
    })
})

class AndCheckClass {
    @property("A", valid.and([
        valid.scalar(),
        valid.strictDeepEqual(12, (v) => JSON.stringify(v)),
    ]))
    public a: any
}

describe("and", () => {
    it("valid", () => {
        const obj = new AndCheckClass()
        obj.a = 12
        const validErrors = validationErrors(obj)
        assert.deepStrictEqual(validErrors, [])
    })

    it("invalid", () => {
        const obj = new AndCheckClass()
        obj.a = "12"
        const validErrors = validationErrors(obj)
        assert.deepStrictEqual(validErrors, [
            "A should be equals to 12, but actual it is \"12\""
        ])
    })
})

class OrCheckClass {
    @property("A", valid.or([
        valid.strictEqual("twelve"),
        valid.strictDeepEqual(12),
    ]))
    public a: any
}

describe("or", () => {
    it("valid", () => {
        const obj = new OrCheckClass()
        obj.a = 12
        const validErrors = validationErrors(obj)
        assert.deepStrictEqual(validErrors, [])
    })

    it("invalid", () => {
        const obj = new OrCheckClass()
        obj.a = "12"
        const validErrors = validationErrors(obj)
        assert.deepStrictEqual(validErrors, [
            "A should be equals to \"twelve\"",
            "A should be equals to special value",
        ])
    })
})

class NotCheckClass {
    @property("A", valid.not(
        valid.strictEqual("twelve"),
    ))
    public a: any
}

describe("not", () => {
    it("valid", () => {
        const obj = new NotCheckClass()
        obj.a = 12
        const validErrors = validationErrors(obj)
        assert.deepStrictEqual(validErrors, [])
    })

    it("invalid", () => {
        const obj = new NotCheckClass()
        obj.a = "twelve"
        const validErrors = validationErrors(obj)
        assert.deepStrictEqual(validErrors, [
            "Value allows condition, thats should not"
        ])
    })
})

class DateCheckClass {
    @property("A", valid.date(
        (d) => (d.getFullYear() === 2022),
    ))
    public a: any
}

describe("date", () => {
    it("valid", () => {
        const obj = new DateCheckClass()
        obj.a = new Date("2022-11-11")
        const validErrors = validationErrors(obj)
        assert.deepStrictEqual(validErrors, [])
    })

    it("invalid 1", () => {
        const obj = new DateCheckClass()
        obj.a = "a"
        const validErrors = validationErrors(obj)
        assert.deepStrictEqual(validErrors, [
            "Property A is not a Date"
        ])
    })

    it("invalid 2", () => {
        const obj = new DateCheckClass()
        obj.a = "2022-11-11"
        const validErrors = validationErrors(obj)
        assert.deepStrictEqual(validErrors, [
            "Property A is not a Date"
        ])
    })

    it("invalid 3", () => {
        const obj = new DateCheckClass()
        obj.a = new Date("2021-01-01")
        const validErrors = validationErrors(obj)
        assert.deepStrictEqual(validErrors, [
            "A is invalid date value Fri Jan 01 2021"
        ])
    })
})

class NumberCheckClass {
    @property("A", valid.number(
        (d) => (d % 2 === 0),
    ))
    public a: any
}

describe("number", () => {
    it("valid", () => {
        const obj = new NumberCheckClass()
        obj.a = 12
        const validErrors = validationErrors(obj)
        assert.deepStrictEqual(validErrors, [])
    })

    it("invalid 1", () => {
        const obj = new NumberCheckClass()
        obj.a = 11
        const validErrors = validationErrors(obj)
        assert.deepStrictEqual(validErrors, [
            "A is invalid number value 11"
        ])
    })

    it("invalid 2", () => {
        const obj = new NumberCheckClass()
        obj.a = "A"
        const validErrors = validationErrors(obj)
        assert.deepStrictEqual(validErrors, [
            "Property A is not a number"
        ])
    })
})

class ObjInstanceCheckClass {
    @property("A", valid.objInstance(Map))
    public a: any
}

describe("objInstance", () => {
    it("valid", () => {
        const obj = new ObjInstanceCheckClass()
        obj.a = new Map()
        const validErrors = validationErrors(obj)
        assert.deepStrictEqual(validErrors, [])
    })

    it("invalid 1", () => {
        const obj = new ObjInstanceCheckClass()
        obj.a = "sada"
        const validErrors = validationErrors(obj)
        assert.deepStrictEqual(validErrors, [
            "A should be object, gets string"
        ])
    })

    it("invalid 2", () => {
        const obj = new ObjInstanceCheckClass()
        obj.a = Array()
        const validErrors = validationErrors(obj)
        assert.deepStrictEqual(validErrors, [
            "A should be instance of Map, gets instance of Array"
        ])
    })
})

class ObjValidModelCheckClass {
    @property("A", valid.objValidModel())
    public a: any
}

describe("objValidModel", () => {
    it("valid", () => {
        const obj = new ObjValidModelCheckClass()
        obj.a = new NumberCheckClass()
        obj.a.a = 12
        const validErrors = validationErrors(obj)
        assert.deepStrictEqual(validErrors, [])
    })

    it("invalid 1", () => {
        const obj = new ObjValidModelCheckClass()
        obj.a = "sada"
        const validErrors = validationErrors(obj)
        assert.deepStrictEqual(validErrors, [
            "A should be object, gets string"
        ])
    })

    it("invalid 2", () => {
        const obj = new ObjValidModelCheckClass()
        obj.a = new NumberCheckClass()
        obj.a.a = "a"
        const validErrors = validationErrors(obj)
        assert.deepStrictEqual(validErrors, [
            "A should be valid Model, but in it: Property A is not a number"
        ])
    })
})

const symB = Symbol("B")
class ObjHasKeysCheckClass {
    @property("A", valid.objHasKeys(["a", symB]))
    public a: any
}

describe("objHasKeys", () => {
    it("valid", () => {
        const obj = new ObjHasKeysCheckClass()
        obj.a = {a: 12, [symB]: "asd"}
        const validErrors = validationErrors(obj)
        assert.deepStrictEqual(validErrors, [])
    })

    it("invalid 1", () => {
        const obj = new ObjHasKeysCheckClass()
        obj.a = "sada"
        const validErrors = validationErrors(obj)
        assert.deepStrictEqual(validErrors, [
            "A should be object, gets string"
        ])
    })

    it("invalid 2", () => {
        const obj = new ObjHasKeysCheckClass()
        obj.a = obj.a = {a: 12, [Symbol("B")]: "asd"}
        const validErrors = validationErrors(obj)
        assert.deepStrictEqual(validErrors, [
            "A should contains key Symbol(B)"
        ])
    })
})

class ObjPropsCheckClass {
    @property("A", valid.objProps({
        a: valid.strictEqual(12),
        [symB]: valid.arrayCount((n) => n === 2)
    }))
    public a: any
}

describe("objProps", () => {
    it("valid", () => {
        const obj = new ObjPropsCheckClass()
        obj.a = {a: 12, [symB]: [0, 0]}
        const validErrors = validationErrors(obj)
        assert.deepStrictEqual(validErrors, [])
    })

    it("invalid 1", () => {
        const obj = new ObjPropsCheckClass()
        obj.a = "sada"
        const validErrors = validationErrors(obj)
        assert.deepStrictEqual(validErrors, [
            "A should be object, gets string"
        ])
    })

    it("invalid 2", () => {
        const obj = new ObjPropsCheckClass()
        obj.a = obj.a = {a: 12, [symB]: [0, 0, 0]}
        const validErrors = validationErrors(obj)
        assert.deepStrictEqual(validErrors, [
            "A contains object, checks by property: Symbol(B) contains array invalid count of items: 3"
        ])
    })
})