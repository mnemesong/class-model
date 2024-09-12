# class-model
Class scheme definition by decorator with type-validators and loaders


## Example of usage
```typescript
import * as classModel from "class-model"

//custom validator funciton
function strNotEmptyValidator(prop: string, label: string, model: any) {
    return (model[prop].length > 0)
            ? []
            : ([label + " should be grater then 0"])
}

//model class
class UserAuth {
    @classModel.property("Login", strNotEmptyValidator)
    login: string

    @classModel.property("Password", strNotEmptyValidator)
    pass: string
}

//loading
const user = new UserAuth()
const loadResult = classModel.loadData(user, {login: "asdsa", pass: "c412"})
assert.strictEqual(loadResult, true)
assert.strictEqual(user.login, "asdsa")
assert.strictEqual(user.pass, "c412")

//validation
const validationErrors1 = classModel.validationErrors(user)
assert.strictDeepEqual(validationErrors1, [])

user.password = ""
const validationErrors2 = classModel.validationErrors(user)
assert.strictDeepEqual(validationErrors2, ["Password should be grater then 0"])

//gettingPropertyLabels
assert.deepStrictEqual(classModel.utils.getAllPropertiesLabels(user), {
    login: "Login",
    pass: "Password",
})
```


## Installation
`npm i class-model`


## Usage

### 1. Set decorator to the property
```typescript
class UserAuth {
    @classModel.property("Login", 
        classModel.valid.strictEqual("asdsa") //validator
    )
    login: string

    @classModel.property("Password", classModel.valid.stringLength(sl => sl > 8))
    pass: string
}
```

### 2. Use load funciton to load structure or object to model using decorated properties
```typescript
const user = new UserAuth()
const loadResult = classModel.loadData(user, {login: "asdsa", pass: "c412"})
assert.strictEqual(loadResult, true)
assert.strictEqual(user.login, "asdsa")
assert.strictEqual(user.pass, "c412")
```

### 3. Use validationErrors function
```typescript
user.password = ""
const validationErrors2 = classModel.validationErrors(user)
assert.strictDeepEqual(validationErrors2, ["Password should be equals \"c412\""])
```


## Utils
Package provides utils functions to access metadata of model
```typescript
//[class-model].utils.dts

import { MakeProperty } from "./make";
import { PropertyValidator } from "./valid";
export declare const __classModelPropertiesKey = "__classModelProperties";
export type PropertyMeta = {
    makeModel: MakeProperty;
    validator: PropertyValidator | null;
    label: string | null;
};
/**
 * Sets property to model
 */
export declare function setProperty(
    model: object, 
    propName: string | symbol, 
    label?: string | null, 
    validator?: PropertyValidator | null, 
    makeModel?: MakeProperty | null
): void;

/**
 * Gets meta-structure with validators and label of property
 */
export declare function getPropertyMeta(
    model: object, 
    propName: string | symbol
): PropertyMeta | null;

/**
 * Get structure kind of {[registeredProperty]: [labelOfProperty]}
 */
export declare function getAllPropertiesLabels(model: object): {};

/**
 * Gets structure kind of {[registeredProperty]: {label: ..., validators: [...]}}
 */
export declare function getAllPropertiesMeta(model: object): Record<string, PropertyMeta>;

/**
 * Get all properties as a string
 */
export declare function getProperties(obj: object): Array<string>;

/**
 * Returns label of property or returns property name
 * if special label had not been registered
 */
export declare function getPropertyLabel(
    model: object, 
    propName: string | symbol
): string;

/**
 * Returns all geristered validators of the property
 */
export declare function getPropertyValidator(
    model: object, 
    propName: string | symbol
): PropertyValidator | null;

/**
 * Returns special constructor of property, is it exists
 */
export declare function getMaybeMakeModelFn(
    model: object, 
    propName: string | symbol
): null | MakeProperty;

```


## Special property constructors
If you want to load aggregated data or define special property construction logic
on loading, you should define special constructor in property decorator

```typescript
class SubModel {
    @classModel.property("A")
    a: number = 12
}

class MakeModelTestClass {
    @classModel.property("As", valid.any(), 
        classModel.make.model(() => new SubModel()) /*special property constructor*/)
    public as: SubModel //aggreagated property
}

const obj = new MakeModelTestClass()
const data = {as: {a: 15}}
const loadResult = classModel.loadData(obj, data)
assert.strictEqual(loadResult, true)
assert.strictEqual(obj.as.a, 15)
```


#### Special property constructors
We prepared two popular constructors in `classModel.make` module:
```typescript
// classModel.make module

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
export declare function int(
    printData?: ((v: any) => string) | null, 
    roundStrategy?: "round" | "floor" | "ceil"
): MakeProperty;

/**
 * Parse data as a boolean
 */
export declare function boolean(): MakeProperty;

```


## Validators
Validator is function kind of:
```typescript
type PropertyValidator = (propName: string, propLabel: string, propVal: any) => string[]
```
Some popular validators are also prepared for you, and keeps in `classModel.valid` module.

#### Validator pakcage
You may use validators from `validator` pakage in property decorator using
`classModel.valid.lambda` validator
```typescript
import {isHexColor} form "validator"

class LambdaCheckClass {
    @property("A", valid.lambda(isHexColor))
    public a: any
}

const obj = new LambdaCheckClass()
obj.a = "#763820"
const validErrors = validationErrors(obj)
assert.deepStrictEqual(validErrors, [])
```
This package is not depends of `validator` package.
Its needs to be installed, before using. 

#### List of validators:
```typescript
//classModel.valid module

export type PropertyValidator = (
    propName: string | symbol, 
    propLabel: string, propVal: any
) => string[];

export type ValuePrinter = (v: any) => string;

/**
 * Strict not deep equals to scalar val
 */
export declare function strictEqual(
    val: string | bigint | number | boolean | null | undefined | symbol, 
    printValue?: ValuePrinter | null
): PropertyValidator;

/**
 * Deep strict equals validator
 */
export declare function strictDeepEqual(
    val: any, 
    printValue?: ValuePrinter | null
): PropertyValidator;

/**
 * Value satisfies operator !!val
 */
export declare function required(): PropertyValidator;

/**
 * Value satisfies operator !val
 */
export declare function empty(): PropertyValidator;

/**
 * Value satisfies filter function
 */
export declare function filterFn(filterFn: (v: any) => boolean): PropertyValidator;

/**
 * Deep strict equals validator
 */
export declare function oneOf(
    vals: Array<any>, 
    printValue?: ValuePrinter | null
): PropertyValidator;

/**
 * Validator allows anything
 */
export declare function any(): PropertyValidator;

/**
 * Validator allows nothing
 */
export declare function never(): PropertyValidator;

/**
 * Checks is value type of bigint, symbol, number, string,
 * boolean or undefined
 */
export declare function scalar(): PropertyValidator;

/**
 * Checks is property value is array of X
 */
export declare function arrayOf(
    itemValidator?: PropertyValidator | null
): PropertyValidator;

/**
 * Checks is property value is array have n of X values
 */
export declare function arrayDeepStrictUnique(
    printVal?: ValuePrinter | null
): PropertyValidator;

/**
 * Checks array count by function
 */
export declare function arrayCount(
    countCheckFn?: ((n: number) => boolean) | null
): PropertyValidator;

/**
 * Checks property is a tuple match tuple of validators
 */
export declare function arrayTuple(
    valids?: PropertyValidator[] | null
): PropertyValidator;

/**
 * Return errors if one of validators are return errors
 */
export declare function and(valids: PropertyValidator[]): PropertyValidator;

/**
 * Return errors if everyone of validators are return errors
 */
export declare function or(valids: PropertyValidator[]): PropertyValidator;

/**
 * Return errors if everyone of validators are return errors
 */
export declare function not(valid: PropertyValidator): PropertyValidator;

/**
 * Date validation by lambda
 */
export declare function date(
    valid?: ((d: Date) => string[] | boolean) | null
): PropertyValidator;

/**
 * Validate number by lambda
 */
export declare function number(
    valid?: ((n: number) => string[] | boolean) | null
): PropertyValidator;

/**
 * Checks object is instance of X
 */
export declare function objInstance(construct?: Function | null): PropertyValidator;

/**
 * Checks object is valid as a Model
 */
export declare function objValidModel(): PropertyValidator;

/**
 * Checks object has keys
 */
export declare function objHasKeys(keys: (string | symbol)[]): PropertyValidator;

/**
 * Checks object values by structure of validators
 */
export declare function objProps(
    propValidators: Record<string | symbol, PropertyValidator>
): PropertyValidator;

/**
 * Validate string by lambda
 */
export declare function string(
    valid?: ((s: string) => string[] | boolean) | null
): PropertyValidator;

/**
 * Validate string by lambda
 */
export declare function stringLength(
    valid?: ((s: number) => string[] | boolean) | null
): PropertyValidator;

/**
 * Validate string by lambda
 */
export declare function stringRegMatch(regex: RegExp | string): PropertyValidator;

/**
 * Validate string by lambda
 */
export declare function stringUuid(): PropertyValidator;

/**
 * Validate boolean value
 */
export declare function boolean(
    valid?: ((s: boolean) => string[] | boolean) | null
): PropertyValidator;

/**
 * validate Symbol value
 */
export declare function symbol(
    valid?: ((s: symbol) => string[] | boolean) | null
): PropertyValidator;

/**
 * Validate value is Null
 */
export declare function isNull(): PropertyValidator;

/**
 * Validate value is Undefined
 */
export declare function isUndefined(): PropertyValidator;

/**
 * Validate value is function
 */
export declare function func(
    valid?: ((s: Function) => string[] | boolean) | null
): PropertyValidator;

/**
 * Validate value by lambda
 * (You may use it with `validator` package)
 */
export declare function lambda(valid: (a: any) => boolean | string[]): PropertyValidator;

```


## Author
Anatoly Starodubtsev
tostar74@mail.ru


## License 
MIT