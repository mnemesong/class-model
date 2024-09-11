import { loadData } from "."
import { getAllPropertiesMeta } from "./utils"

export type MakeModel = (data: any) => any

/**
 * Load model uses getter
 */
export function model(getModel: () => object): MakeModel {
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
export function modelsArray(getModel: () => object): MakeModel {
    return function(data) {
        if(!Array.isArray(data)) {
            throw new Error("try to load models array by not array of data")
        }
        const loader = model(getModel)
        return data.map(v => loader(v))
    }
}