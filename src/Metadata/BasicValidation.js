export const CaseConversion = {
    NONE: 'NONE',
    UPPERCASE: 'UPPERCASE',
    LOWERCASE: 'LOWERCASE',
    UPPER: 'UPPERCASE', // Alias for compatibility
    LOWER: 'LOWERCASE'  // Alias for compatibility
};

export class ValidationRules {
    constructor(fieldName, ...args) {
        this.minLength = 0;
        this.maxLength = 0;
        this.caseConversion = CaseConversion.NONE;
        this.fieldName = fieldName;
        this.minValue = -Number.MAX_VALUE;
        this.maxValue = Number.MAX_VALUE;
        this.type = Object;
        this.preventThisValue = null;
        this.values = null;

        // Determine which constructor to use based on arguments
        if (args.length >= 3 && typeof args[0] === 'number' && typeof args[1] === 'number') {
            if (Array.isArray(args[0])) {
                // Constructor with values array
                this._initWithValues(fieldName, ...args);
            } else {
                // Check if it's string-based (minLength, maxLength) or numeric (minValue, maxValue)
                if (args.length === 4 && typeof args[2] === 'string') {
                    // String constructor: (fieldName, minLength, maxLength, caseConversion, preventThisValue)
                    this._initString(fieldName, ...args);
                } else if (args.length === 3 && typeof args[0] === 'number' && typeof args[1] === 'number') {
                    // Numeric constructor: (fieldName, minValue, maxValue, preventThisValue)
                    this._initNumeric(fieldName, ...args);
                }
            }
        } else if (args.length === 5 && Array.isArray(args[0])) {
            // Constructor with values array
            this._initWithValues(fieldName, ...args);
        }
    }

    _initString(fieldName, minLength, maxLength, caseConversion, preventThisValue) {
        this.fieldName = fieldName;
        this.minLength = minLength;
        this.maxLength = maxLength;
        this.caseConversion = caseConversion;
        this.type = String;
        this.preventThisValue = preventThisValue;
    }

    _initNumeric(fieldName, minValue, maxValue, preventThisValue) {
        this.fieldName = fieldName;
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.type = Number;
        this.preventThisValue = preventThisValue;
    }

    _initWithValues(fieldName, values, minLength, maxLength, caseConversion, preventThisValue) {
        this.fieldName = fieldName;
        this.values = values;
        this.minLength = minLength;
        this.maxLength = maxLength;
        this.caseConversion = caseConversion;
        this.minValue = null;
        this.maxValue = null;
        this.type = String;
        this.preventThisValue = preventThisValue;
    }

    /**
     * Validates a value against validation rules.
     * @param {string|number} value - The value to validate
     * @returns {string|null} - Returns null if valid, otherwise returns error message
     */
    validate(value) {
        if (this.type === Number) {
            return this.applyRulesToDoubleValue(Number(value));
        } else if (this.type === String) {
            return this.applyRulesToStringValue(String(value));
        } else {
            throw new Error('Cannot enforce rules on this type.');
        }
    }

    /**
     * Validates the text of a field against validation rules.
     * Does not modify the value.
     * @param {string} xTextValueOfField - The text value to validate
     * @returns {string|null} - Returns null when no violations, otherwise text of violation
     */
    applyRulesToStringValue(xTextValueOfField) {
        const errorMessages = [];
        const reformattedTextOfField = this.reformatStringUsingRules(xTextValueOfField);

        if (reformattedTextOfField.length < this.minLength) {
            errorMessages.push(`'${this.fieldName}' must be at least ${this.minLength} characters in length.`);
        } else if (reformattedTextOfField.length > this.maxLength) {
            errorMessages.push(`'${this.fieldName}' must not exceed ${this.maxLength} characters in length.`);
        }

        if (this.preventThisValue !== null && reformattedTextOfField === this.preventThisValue) {
            errorMessages.push(`Please enter a value for '${this.fieldName}', the default is not sufficient.`);
        } else {
            // Did the creator provide a list of allowed values, and is the input in that list
            if (this.values !== null) {
                let oneMatch = false;
                for (const value of this.values) {
                    if (value === reformattedTextOfField) {
                        oneMatch = true;
                        break;
                    }
                }
                if (!oneMatch) {
                    errorMessages.push(`'${this.fieldName}' should be one of the following: {${this.getListOfPermittedValues()}}`);
                }
            }
        }

        if (errorMessages.length === 0) {
            return null;
        }
        return errorMessages.join('\n');
    }

    /**
     * Validates a string value against rules.
     * @param {string} xValue - The string value to check
     * @returns {string|null} - Returns null if no error detected, otherwise a String message with the error
     */
    doesStringComplyWithRules(xValue) {
        const valueAfterReformat = this.reformatStringUsingRules(xValue.trim());
        const resultOfVerification = this.applyRulesToStringValue(xValue.trim());
        return resultOfVerification;
    }

    /**
     * Validates a numeric value against rules.
     * @param {number} value - The numeric value to validate
     * @returns {string|null} - Returns null if valid, otherwise returns error message
     */
    applyRulesToDoubleValue(value) {
        const numValue = Number(value);

        if (isNaN(numValue)) {
            return `'${this.fieldName}' must be a valid number.`;
        }

        if (numValue < this.minValue) {
            return `'${this.fieldName}' must be greater than or equal to ${this.minValue}.`;
        } else if (numValue > this.maxValue) {
            return `'${this.fieldName}' must not exceed ${this.maxValue}.`;
        }

        return null;
    }

    /**
     * Reformat the input string based on validation rules. Method does not enforce any rules.
     * @param {string} xValue - The value to reformat
     * @returns {string} - The reformatted value
     */
    reformatStringUsingRules(xValue) {
        let reformattedTextOfField = xValue;

        switch (this.caseConversion) {
            case CaseConversion.NONE:
                break;
            case CaseConversion.LOWER:
            case CaseConversion.LOWERCASE:
                reformattedTextOfField = xValue.toLowerCase().trim();
                break;
            case CaseConversion.UPPER:
            case CaseConversion.UPPERCASE:
                reformattedTextOfField = xValue.toUpperCase().trim();
                break;
            default:
                throw new Error(`Unexpected value: ${this.caseConversion}`);
        }

        return reformattedTextOfField;
    }

    /**
     * Return a comma separated list of permitted values.
     * @returns {string|null} - List of values, or null if no values or not String type
     */
    getListOfPermittedValues() {
        if (this.values === null || this.type !== String) {
            return null;
        }

        return this.values.join(',');
    }

    /**
     * Get values as string array.
     * @returns {string[]} - The values array
     */
    valuesAsString() {
        return this.values;
    }
}