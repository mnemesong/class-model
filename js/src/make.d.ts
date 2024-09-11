export type MakeModel = (data: any) => any;
/**
 * Load model uses getter
 */
export declare function model(getModel: () => object): MakeModel;
/**
 * Load array of models uses getter
 */
export declare function modelsArray(getModel: () => object): MakeModel;
