1. + Add aggregatied structures loading
2. + Rework type of model from any to object
3. + Add Readme.md
4.   Make validators
    - array
        - arrayContains
        - arrayMaxSize
        - arrayMinSize
        - arrayNotContains
        - arrayUnique
        - arrayEvery
    - common
        - equals
        - required
        - empty
        - in
    - modifiers
        - and
        - or
        - promise
        - not
    - date
        - dateMax
        - dateMin
    - number
        - numDivBy
        - numNegative
        - numPositive
        - numMax
        - numMin
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
5.   Make special constructors
    - model
    - arrayOfModels