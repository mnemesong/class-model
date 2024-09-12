1. + Add aggregatied structures loading
2. + Rework type of model from any to object
3. + Add Readme.md
4.   Make validators
    + array
        + arrayUnique
        + arrayOf
        + arrayCount
        + arrayTuple
    + common
        + equals
        + required
        + empty
        + in
        + scalar
        + never
        + any
    + modifiers
        + and
        + or
        + not
    + date
        + date
    + number
        + number
    + object
        + objInstance
        + objValidModel
        + objHasKeys
    - string
        - string
        - stringLength
    - boolean
        - boolean
    - symbol
        - symbol
    - unit
        - null
        - undefined
5. + Make special constructors
    + model
    + arrayOfModels
    + bigint