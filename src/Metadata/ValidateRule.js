import {getValidationRuleByName, REQUIRED_NONE, VALIDATION_RULES} from "./Domain.jsx";

export const CaseConversion = {
    NONE: 'NONE',
    UPPERCASE: 'UPPERCASE',
    LOWERCASE: 'LOWERCASE',
    UPPER: 'UPPERCASE', // Alias for compatibility
    LOWER: 'LOWERCASE'  // Alias for compatibility
};




export class ValidationRule {
    constructor(options) {
        // Set defaults
        this.fieldName = options.fieldName;
        this.minLength = options.minLength ?? 0;
        this.maxLength = options.maxLength ?? 0;
        this.caseConversion = options.caseConversion ?? CaseConversion.NONE;
        this.minValue = options.minValue ?? -Number.MAX_VALUE;
        this.maxValue = options.maxValue ?? Number.MAX_VALUE;
        this.type = options.type;
        this.preventThisValue = options.preventThisValue ?? null;
        this.values = options.values ?? null;
        this.whenRequired = options.whenRequired ?? REQUIRED_NONE;
        this.defaultValue = options.defaultValue ?? null;
    }

    /**
     * Validates a value against validation rules.
     * @param {string|number} value - The value to validate
     * @returns {string|null} - Returns null if valid, otherwise returns error message
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
        return this.applyRulesToStringValue(xValue.trim());
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

/**
 *
 * @param event belonging to a form.  One of the "submit" buttons.
 * @returns {string} contains error messages if any.  Otherwise, zero length string.
 */
export const validateAllFieldsOnForm = (event ) => {

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

/**
 * Converts validation rules to GridColDef array for Material-UI DataGrid
 * @returns {Array} Array of GridColDef objects
 */
export const getGridColumns = () => {
    return VALIDATION_RULES.map(rule => ({
        field: rule.fieldName.toLowerCase(),
        headerName: rule.fieldName,
        width: calculateColumnWidth(rule),
        editable: true,
        type: rule.type === 'number' ? 'number' : 'string',
        ...(rule.type === 'number' && {
            valueParser: (value) => Number(value),
        }),
    }));
};

/**
 * Calculate column width based on validation rule constraints
 * @param {ValidationRule} rule - The validation rule
 * @returns {number} Suggested column width in pixels
 */
const calculateColumnWidth = (rule) => {
    if (rule.type === 'number') {
        return 120;
    }
    
    const maxLength = rule.maxLength || 150;
    // Estimate: ~8 pixels per character, with min of 100 and max of 300
    return Math.min(Math.max(maxLength * 8, 100), 300);
};

/**
 * Get GridColDef for specific fields by name
 * @param {string[]} fieldNames - Array of field names to include
 * @returns {Array} Array of GridColDef objects for specified fields
 */
export const getGridColumnsForFields = (fieldNames) => {
    const allColumns = getGridColumns();
    return allColumns.filter(col => 
        fieldNames.some(name => name.toLowerCase() === col.field)
    );
};

