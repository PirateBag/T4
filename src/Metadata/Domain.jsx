import {ValidationRule} from './ValidateRule.js';
import {CaseConversion, REQUIRED_ADD} from "./ValidationRuleConstants.js";

/**
 * Validation rules for username field
 * - Min length: 3 characters
 * - Max length: 20 characters
 * - Case: lowercase
 * - Prevents default value 'user'
 */

export const USERNAME_VALIDATION = new ValidationRule({
    domainName: 'userName',
    type: 'text',
    minLengthInChars: 3,
    maxLengthInChars: 20,
    caseConversion: CaseConversion.NONE,
    defaultValue: 'fred',
    whenRequired: REQUIRED_ADD
});

/**
 * Validation rules for password field
 * - Min length: 8 characters
 * - Max length: 50 characters
 * - Case: none (case-sensitive)
 * - Prevents default value 'password'
 */
export const PASSWORD_VALIDATION = new ValidationRule({
    domainName: 'password',
    type: 'password',
    minLength: 6,
    maxLength: 50,
    caseConversion: CaseConversion.NONE,
    defaultValue: 'dilban',
    whenRequired: REQUIRED_ADD
});

/**
 * Validation rules for SummaryId field
 * - Min length: 6 characters
 * - Max length: 50 characters
 * - Case: none
 * - Prevents default value 'password'
 */
export const SUMMARYID_VALIDATION = new ValidationRule({
    domainName: 'summaryId',
    type: 'text',
    minLengthInChars: 6,
    maxLengthInChars: 10,
    caseConversion: CaseConversion.NONE,
    whenRequired: REQUIRED_ADD,
    defaultHeader: 'Summary ID'
});

/**
 * Validation rules for any ID reference, be it Primary or foreign key.
 * It is likely additional support will be required to provide picklists.
 * - Min length: 1 character
 * - Max length: 10 characters
 * - Case: none
 * - Prevents default value 'password'
 */
export const ID_VALIDATION = new ValidationRule({
    domainName: 'id',
    type: 'number',
    minLengthInChars: 1,
    maxLengthInChars: 4,
    caseConversion: CaseConversion.NONE,
    whenRequired: REQUIRED_ADD,
    defaultHeader: 'Id'
});


/**
 * Validation rules for any cost reference.
 * PIt is likely additional support will be required to provide picklists.
 * - Min length: 1 character
 * - Max length: 10 characters
 * - Case: none
 * - Prevents default value 'password'
 */
export const COST_VALIDATION = new ValidationRule({
    domainName: 'unitCost',
    type: 'number',
    minLengthInChars: 1,
    maxLengthInChars: 10,
    caseConversion: CaseConversion.NONE,
    whenRequired: REQUIRED_ADD,
    defaultValue: 0.0,
    defaultHeader: 'Unit Cost'
});

/**
 * Validation rules for Sourcing.  Presentation is a three-character upper case string.
 * - Min length: 3 characters
 * - Max length: 3 characters
 * - Case: none
 * - Prevents default value 'password'
 */
export const SOURCING_VALIDATION = new ValidationRule({
    domainName: 'sourcing',
    type: 'singleSelect',
    minLengthInChars: 3,
    maxLengthInChars: 3,
    caseConversion: CaseConversion.NONE,
    whenRequired: REQUIRED_ADD,
    valueOptions: ['MAN', 'PUR' ],
    defaultValue: 'MAN',
    defaultHeader: 'Source'
});



/**
 * Validation rules for Description field
 * - Min length: 6 characters
 * - Max length: 50 characters
 * - Case: none
 * - Prevents default value 'password'
 */
export const DESCRIPTION_VALIDATION = new ValidationRule({
    type: 'text',
    domainName: 'description',
    defaultHeader: 'Description',
    minLengthInChars: 6,
    maxLengthInChars: 30,
    caseConversion: CaseConversion.NONE
});


/* Validation rules for any depth reference.
* - Min length: 1 character
* - Max length: 3 characters
* - Case: none
*/
export const MAX_DEPTH_VALIDATION = new ValidationRule({
    domainName: 'maxDepth',
    type: 'number',
    minLengthInChars: 1,
    maxLengthInChars: 3,
    caseConversion: CaseConversion.NONE,
    whenRequired: REQUIRED_ADD,
    defaultValue: 0,
    defaultHeader: 'Depth'
});

/* Validation rules for any depth reference.
* - Min length: 1 character
* - Max length: 3 characters
* - Case: none
*/
export const LEAD_TIME_VALIDATION = new ValidationRule({
    domainName: 'leadTime',
    type: 'number',
    minLengthInChars: 1,
    maxLengthInChars: 9,
    caseConversion: CaseConversion.NONE,
    whenRequired: REQUIRED_ADD,
    defaultValue: 0,
    defaultHeader: 'Lead Time'
});


/* Validation rules for any depth reference.
* - Min length: 1 character
* - Max length: 3 characters
* - Case: none
*/
export const QUANTITY_VALIDATION = new ValidationRule({
    domainName: 'quantityOnHand',
    type: 'number',
    minLengthInChars: 1,
    maxLengthInChars: 8,
    caseConversion: CaseConversion.NONE,
    whenRequired: REQUIRED_ADD,
    defaultValue: 0.0,
    defaultHeader: 'On Hand'
});

/**
 * Array of all validation rules
 */
export const VALIDATION_RULES = [
    USERNAME_VALIDATION,
    PASSWORD_VALIDATION,
    SUMMARYID_VALIDATION,
    DESCRIPTION_VALIDATION,
    ID_VALIDATION,
    COST_VALIDATION,
    SOURCING_VALIDATION,
    MAX_DEPTH_VALIDATION,
    LEAD_TIME_VALIDATION,
    QUANTITY_VALIDATION
];

/**
 * Get validation rule by field name
 * @param {string} domainName - The name of the field to find validation rules for
 * @returns {ValidationRule|null} - The validation rule or null if not found
 */
export const getValidationRuleByName = (domainName ) => {
    if (domainName === undefined ) {
        console.warn('Undefined field name');
    }
    const validationRule = domainName.toLowerCase();

    return VALIDATION_RULES.find(rule =>
        rule.domainName.toLowerCase() === validationRule
    ) || null;
};

/**
 * Validate a field by name
 * @param {string} fieldName - The name of the field
 * @param {string|number} value - The value to validate
 * @param whenRequired See one of the REQUIRED_* constants.
 * @returns {string|null} - Error message or null if valid
 */
/*
export const validateField = (fieldName, value, whenRequired ) => {
    const rule = getValidationRuleByName(fieldName );
    if ( rule.whenRequired.includes( whenRequired )) {
        return rule.validate(value);
    }
    if (!rule) {
        console.warn(`No validation rule found for field: ${fieldName}`);
        return null;
    }
    return null;
};*/
