# class-model
Class scheme definition by decorator with type-validators and loaders


## Example of usage
```typescript
import * as classModel from "class-model"

//custom validator funciton
function strNotEmpty(prop: string, label: string, model: any) {
    return (model[prop].length > 0)
            ? []
            : ([label + " should be grater then 0"])
}

//model class
class UserAuth {
    @classModel.property("Login", [strNotEmpty])
    login: string

    @classModel.property("Password", [strNotEmpty])
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
```


## Installation
`npm i class-model`


## Usage

### 1. Set decorator to the property
```typescript
class UserAuth {
    @classModel.property("Login", [
        //validator
        classModel.valid.strictEqual("asdsa")
    ])
    login: string

    @classModel.property("Password", [
        //validator
        classModel.valid.strictEqual("c412")
    ])
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

### 4. Use [package].utils functions to access metadata of model
```typescript
//[class-model].utils.dts
import { PropertyValidator } from "./validators";
export declare const __classModelPropertiesKey = "__classModelProperties";
export type PropertyMeta = {
    specialConstructor: SpecialConstructor;
    validators: Array<PropertyValidator>;
    label: string | null;
};

type SpecialConstructor = (data: any) => object;
/**
 * Gets meta-structure with validators and label of property
 */
export declare function getPropertyMeta(model: object, propName: string | symbol): PropertyMeta | null;
/**
 * Get structure kind of {[registeredProperty]: [labelOfProperty]}
 */
export declare function getAllPropertiesLabels(model: object): {};
/**
 * Gets structure kind of {[registeredProperty]: {label: ..., validators: [...]}}
 */
export declare function getAllPropertiesMeta(model: object): Record<string, PropertyMeta>;
/**
 * Decorator factory for defining property
 */
export declare function property(label: string | null, validators: Array<PropertyValidator>, specialConstructor?: SpecialConstructor | null): PropertyDecorator;
/**
 * Get all properties as a string
 */
export declare function getProperties(obj: object): Array<string>;
/**
 * Returns label of property or returns property name
 * if special label had not been registered
 */
export declare function getPropertyLabel(model: object, propName: string | symbol): string;
/**
 * Returns all geristered validators of the property
 */
export declare function getPropertyValidators(model: object, propName: string | symbol): PropertyValidator[];
/**
 * Validates object by registered validators and returns error messages array
 */
export declare function validationErrors(model: object): Array<string>;
/**
 * Returns special constructor of property, is it exists
 */
export declare function getMaybeSpecialConstructor(model: object, propName: string | symbol): null | SpecialConstructor;
/**
 * Load data from object to model by all registered properties
 * Returns true if loading had been successfull, false else
 */
export declare function loadData(model: object, data: any): boolean;
```


## Validators
Validator is function kind of:
```typescript
type PropertyValidator = (propName: string, propLabel: string, propVal: any) => string[]
```
Some popular validators are also prepared for you, and keeps in `classModel.valid`
module.

#### List of validators:
```typescript
//classModel.valid module
/**
 * Strict not deep equals to scalar val
 */
export declare function strictEquals(
    val: string | bigint | number | boolean | null | undefined | symbol, 
    printActualVal?: boolean
): PropertyValidator;

/**
 * Deep strict equals validator
 */
export declare function strictDeepEquals(
    val: any, 
    printActualVal?: boolean, 
    serialize?: ((v: any) => string) | null
): PropertyValidator;

```


## Special property constructors
If you want to load aggregated data or define special property construction logic
on loading, you should define special constructor in property decorator

```typescript
class SubModel {
    @classModel.property("A", [])
    a: number = 12
}

class MakeModelTestClass {
    @classModel.property("As", [], 
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
export declare function bigInt(): MakeProperty;

```


## Author
Anatoly Starodubtsev
tostar74@mail.ru


## License 
MIT