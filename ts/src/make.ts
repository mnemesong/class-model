import { loadData } from "."

export type MakeProperty = (data: any) => any

/**
 * Load model uses getter
 */
export function model(getModel: () => object): MakeProperty {
    return function(data) {
        if(typeof data !== "object") {
            throw new Error("Cannot load not object data to model")
        }
        const obj = getModel()
        const loaded = loadData(obj, data)
        if(loaded === false) {
            throw new Error("Error on loading model property")
        }
        return obj
    }
}

/**
 * Load array of models uses getter
 */
export function modelsArray(getModel: () => object): MakeProperty {
    return function(data) {
        if(!Array.isArray(data)) {
            throw new Error("try to load models array by not array of data")
        }
        const loader = model(getModel)
        return data.map(v => loader(v))
    }
}

/**
 * Load bigint
 */
export function bigInt(): MakeProperty {
    return function(data) {
        if(!["bigint", "number", "string", "boolean"].includes(typeof data)) {
            throw new Error("Try to construct bigint from invalid data value")
        }
        return BigInt(data)
    }
}

/**
 * Constructs Date from loading data
 */
export function date(
    printData: ((v: any) => string)|null = null
): MakeProperty {
    return function(data) {
        const dataObj = (data instanceof Date)
            ? data
            : (new Date(data))
        if(isNaN((dataObj as any))) {
            throw new Error("Constructs invalid Date from value" 
                + (!printData ? "" : (": " + printData(data))))
        }
        return dataObj
    }
}