import {CaseConversion, REQUIRED_NONE} from "./ValidationRuleConstants.js";

export class ValidationRule {
    constructor(options) {
        this.domainName = options.domainName;
        this.field = options.field ?? this.domainName;
        this.minLengthInChars = options.minLength ?? 0;
        this.maxLengthInChars = options.maxLength ?? 0;
        this.caseConversion = options.caseConversion ?? CaseConversion.NONE;
        this.minValue = options.minValue ?? -Number.MAX_VALUE;
        this.maxValue = options.maxValue ?? Number.MAX_VALUE;
        this.type = options.type;
        this.preventThisValue = options.preventThisValue ?? null;
        this.valueOptions = options.valueOptions ?? null;
        this.whenRequired = options.whenRequired ?? REQUIRED_NONE;
        this.defaultValue = options.defaultValue ?? null;
        this.headerName = options.header ?? options.domainName;
        this.placeholder = options.placeholder ?? this.headerName;
    }

    /**
     * Given a domainName which references a validation rule, return a GridColDef object with the specified options.
     * @param girdfieldOption
     * @returns Combined validation and GridFieldOptions with recalculation values.
     */
    appendGridFieldOptions( girdfieldOption ) {
        //  Required for GridColumns...
        const combinedRule = {...this, ...girdfieldOption };

        /*  Width is in pixels.  */
        combinedRule.width = girdfieldOption.width ?? Math.max(combinedRule.maxLengthInChars, combinedRule.headerName.length) * 10;
        return combinedRule;
    }



    /**
     * Validates a value against validation rules.
     * @param {string|number} value - The value to validate
     * @returns {string|null} - Returns null if valid, otherwise returns an error message
     */
    validate(value) {
        if (this.type === "number") {
            return this.applyRulesToDoubleValue(Number(value));
        } else if (this.type === "text" || this.type === "password" ) {
            return this.applyRulesToStringValue(String(value));
        } else {
            throw new Error('Cannot enforce rules on this type.  ' + this.type);
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

        if (reformattedTextOfField.length < this.minLengthInChars) {
            errorMessages.push(`'${this.domainName}' must be at least ${this.minLengthInChars} characters in length.`);
        } else if (reformattedTextOfField.length > this.maxLengthInChars) {
            errorMessages.push(`'${this.domainName}' must not exceed ${this.maxLengthInChars} characters in length.`);
        }

        if (this.preventThisValue !== null && reformattedTextOfField === this.preventThisValue) {
            errorMessages.push(`Please enter a value for '${this.domainName}', the default is not sufficient.`);
        } else {
            // Did the creator provide a list of allowed values and is the input in that list
            if (this.valueOptions !== null) {
                let oneMatch = false;
                for (const value of this.valueOptions) {
                    if (value === reformattedTextOfField) {
                        oneMatch = true;
                        break;
                    }
                }
                if (!oneMatch) {
                    errorMessages.push(`'${this.domainName}' should be one of the following: {${this.getListOfPermittedValues()}}`);
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
        return this.applyRulesToStringValue(xValue.trim());
    }

    /**
     * Validates a numeric value against rules.
     * @param {number} value - The numeric value to validate
     * @returns {string|null} - Returns null if valid, otherwise returns an error message
     */
    applyRulesToDoubleValue(value) {
        const numValue = Number(value);

        if (isNaN(numValue)) {
            return `'${this.domainName}' must be a valid number.`;
        }

        if (numValue < this.minValue) {
            return `'${this.domainName}' must be greater than or equal to ${this.minValue}.`;
        } else if (numValue > this.maxValue) {
            return `'${this.domainName}' must not exceed ${this.maxValue}.`;
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
     * Return a comma-separated list of permitted values.
     * @returns {string|null} - List of values, or null if no values or not String type
     */
    getListOfPermittedValues() {
        if (this.valueOptions === null ) {
            return null;
        }

        return this.valueOptions;
    }

    /**
     * Get values as a string array.
     * @returns {string[]} - The array of values
     */
    valuesAsString() {
        return this.valueOptions;
    }

/**
 *
 * @param event belonging to a form.  One of the "submit" buttons.
 * @returns {string} contains error messages if any.  Otherwise, zero length string.

export const validateAllFieldsOnForm = ( event ) => {

    const formData = new FormData(event.target);
    const fieldsForValidation = Object.fromEntries(formData.entries());
    let combinedMessages = "";


    for (const [key, value] of Object.entries(fieldsForValidation)) {
        const resultsOfValidation = getValidationRuleByName(key).validate(value );
        if (resultsOfValidation != null) {
            combinedMessages = combinedMessages + "\n" + resultsOfValidation;
        }
    }
    return combinedMessages;
 }
 */
}

