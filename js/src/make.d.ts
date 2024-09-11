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
export declare function bigInt(printData?: ((v: any) => string) | null): MakeProperty;
/**
 * Constructs Date from loading data
 */
export declare function date(printData?: ((v: any) => string) | null): MakeProperty;
/**
 * Parse data as a Float
 */
export declare function float(printData?: ((v: any) => string) | null): MakeProperty;
/**
 * Parse data as a Float
 */
export declare function int(printData?: ((v: any) => string) | null, roundStrategy?: "round" | "floor" | "ceil"): MakeProperty;
