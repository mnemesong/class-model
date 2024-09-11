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
    - object
        - objInstance
        - objNotEmpty
        - objValidModel
    - string
        - strContains
        - strISO4217Currency
        - strRegMatch
        - strJSON
        - strXML
        - strUppercase
        - strUrl
        - strUuid
        - strMaxLength
        - strMinLength
        - strNotContains
5. + Make special constructors
    + model
    + arrayOfModels
    + bigint