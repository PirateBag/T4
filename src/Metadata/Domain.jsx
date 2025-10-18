import { ValidationRules, CaseConversion } from './BasicValidation.js';

/**
 * Validation rules for username field
 * - Min length: 3 characters
 * - Max length: 20 characters
 * - Case: lowercase
 * - Prevents default value 'user'
 */
const USERNAME_VALIDATION = new ValidationRules(
    'Username',
    3,
    20,
    CaseConversion.NONE,
    'user'
);

/**
 * Validation rules for password field
 * - Min length: 8 characters
 * - Max length: 50 characters
 * - Case: none (case-sensitive)
 * - Prevents default value 'password'
 */
const PASSWORD_VALIDATION = new ValidationRules(
    'Password',
    6,
    50,
    CaseConversion.NONE,
    'password'
);

/**
 * Array of all validation rules
 */
export const VALIDATION_RULES = [
    USERNAME_VALIDATION,
    PASSWORD_VALIDATION
];

/**
 * Get validation rule by field name
 * @param {string} fieldName - The name of the field to find validation rules for
 * @returns {ValidationRules|null} - The validation rule or null if not found
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
 * @returns {string|null} - Error message or null if valid
 */
export const validateField = (fieldName, value) => {
    const rule = getValidationRuleByName(fieldName);
    if (!rule) {
        console.warn(`No validation rule found for field: ${fieldName}`);
        return null;
    }
    return rule.validate(value);
};





