import {CaseConversion, ValidationRule} from './ValidateRule.js';

/**
 * Validation rules for username field
 * - Min length: 3 characters
 * - Max length: 20 characters
 * - Case: lowercase
 * - Prevents default value 'user'
 */

export const REQUIRED_NONE = 'none';
export const REQUIRED_ADD = 'add';

const USERNAME_VALIDATION = new ValidationRule({
    fieldName: 'Username',
    type: 'text',
    minLength: 3,
    maxLength: 20,
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
const PASSWORD_VALIDATION = new ValidationRule({
    fieldName: 'password',
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
const SUMMARYID_VALIDATION = new ValidationRule({
    fieldName: 'summaryId',
    type: 'text',
    minLength: 6,
    maxLength: 10,
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
const ID_VALIDATION = new ValidationRule({
    fieldName: 'id',
    type: 'number',
    minLength: 1,
    maxLength: 4,
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
const COST_VALIDATION = new ValidationRule({
    fieldName: 'unitCost',
    type: 'number',
    minLength: 1,
    maxLength: 10,
    caseConversion: CaseConversion.NONE,
    whenRequired: REQUIRED_ADD,
    defaultValue: 0.0,
    defaultHeader: 'Unit Cost'
});

/**
 * Validation rules for Sourcing.  Presentation is a three character upper case string.
 * - Min length: 3 characters
 * - Max length: 3 characters
 * - Case: none
 * - Prevents default value 'password'
 */
const SOURCING_VALIDATION = new ValidationRule({
    fieldName: 'sourcing',
    type: 'singleSelect',
    minLength: 3,
    maxLength: 3,
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
const DESCRIPTION_VALIDATION = new ValidationRule({
    type: 'text',
    fieldName: 'description',
    defaultHeader: 'Description',
    minLength: 6,
    maxLength: 30,
    caseConversion: CaseConversion.NONE
});


/* Validation rules for any depth reference.
* - Min length: 1 character
* - Max length: 3 characters
* - Case: none
*/
const MAX_DEPTH_VALIDATION = new ValidationRule({
    fieldName: 'maxDepth',
    type: 'number',
    minLength: 1,
    maxLength: 3,
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
const LEAD_TIME_VALIDATION = new ValidationRule({
    fieldName: 'leadTime',
    type: 'number',
    minLength: 1,
    maxLength: 9,
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
const QUANTITY_VALIDATION = new ValidationRule({
    fieldName: 'quantityOnHand',
    type: 'number',
    minLength: 1,
    maxLength: 8,
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
 * @param {string} fieldName - The name of the field to find validation rules for
 * @returns {ValidationRule|null} - The validation rule or null if not found
 */
export const getValidationRuleByName = (fieldName) => {
    return VALIDATION_RULES.find(rule =>
        rule.fieldName.toLowerCase() === fieldName.toLowerCase()
    ) || null;
};

/**
 * Validate a field by name
 * @param {string} fieldName - The name of the field
 * @param {string|number} value - The value to validate
 * @param whenRequired See one of the REQUIRED_* constants.
 * @returns {string|null} - Error message or null if valid
 */
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
};
