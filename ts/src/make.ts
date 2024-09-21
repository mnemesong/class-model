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
        if(!data) {
            return []
        }
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
export function bigInt(
    printData: ((v: any) => string)|null = null
): MakeProperty {
    return function(data) {
        try {
            return BigInt(data as string)
        } catch (e) {
            throw new Error("Try to parse as a bigint invalid value" 
                + (!printData ? "" : (": " + printData(data))))
        }
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
            throw new Error("Try to parse as a Date invalid value" 
                + (!printData ? "" : (": " + printData(data))))
        }
        return dataObj
    }
}

/**
 * Parse data as a Float
 */
export function float(
    printData: ((v: any) => string)|null = null
): MakeProperty {
    return function(data) {
        let number = NaN
        switch (typeof data) {
            case "number":
                number = data;
                break;
            case "bigint":
            case "boolean":
                number = (Number(data));
                break;
            case "string":
                number = parseFloat(data);
                break;
        }
        if(isNaN(number)) {
            throw new Error("Try to parse as a float invalid value" 
                + (!printData ? "" : (": " + printData(data))))
        }
        return number
    }
}

/**
 * Parse data as a Float
 */
 export function int(
    printData: ((v: any) => string)|null = null,
    roundStrategy: "round"|"floor"|"ceil" = "round"
): MakeProperty {
    return function(data) {
        const round = (roundStrategy === "round")
            ? Math.round
            : ((roundStrategy === "ceil")
                ? Math.ceil
                : Math.floor)
        let number = NaN
        switch (typeof data) {
            case "number":
                number = round(data);
                break;
            case "bigint":
            case "boolean":
                number = (round(Number(data)));
                break;
            case "string":
                number = parseInt(data);
                break;
        }
        if(isNaN(number)) {
            throw new Error("Try to parse as a int invalid value" 
                + (!printData ? "" : (": " + printData(data))))
        }
        return number
    }
}

/**
 * Parse data as a boolean
 */
 export function boolean(): MakeProperty {
    return function(data) {
        return !!data
    }
}

/**
 * Parse data as a string
 */
 export function string(): MakeProperty {
    return function(data) {
        let converted: string = undefined
        switch (typeof data) {
            case "string":
                converted = data;
                break;
            case "number":
            case "bigint":
            case "symbol":
                converted = data.toString()
                break;
            case "boolean":
                converted = !data ? "false" : "true"
                break;
            case "undefined":
                converted = ""
                break;
            case "object":
                if(data !== null) {
                    throw new Error("Can not convert object to string")
                }
                converted = ""
                break;
        }
        return converted
    }
}

/**
 * Parse data as array
 */
 export function arrayOf(make: MakeProperty|null = null): MakeProperty {
    return function(data) {
        if(!data) {
            return []
        }
        const arr = Array.isArray(data) ? data : [data]
        return !make
            ? arr
            : arr.map(v => make(v))
    }
}