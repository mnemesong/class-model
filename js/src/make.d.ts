export type MakeProperty = (data: any) => any;
/**
 * Load model uses getter
 */
export declare function model(getModel: () => object): MakeProperty;
/**
 * Load array of models uses getter
 */
export declare function modelsArray(getModel: () => object): MakeProperty;
/**
 * Load bigint
 */
export declare function bigInt(): MakeProperty;