import { ValidationRule } from './src/Metadata/ValidateRule.js';
import { CaseConversion } from './src/Metadata/ValidationRuleConstants.js';
import { validateFieldsOfObject } from './src/Metadata/ValidateRule.js';

// Mock some dependencies if needed, or just test the function directly
// Note: ValidationRule depends on Domain.jsx which we are not fully importing here
// But we can create standalone ValidationRule instances for testing

const rule1 = new ValidationRule({
    field: 'name',
    header: 'Name',
    type: 'text',
    minLengthInChars: 3,
    maxLengthInChars: 10,
    caseConversion: CaseConversion.NONE
});

const rule2 = new ValidationRule({
    field: 'age',
    header: 'Age',
    type: 'number',
    minValue: 18,
    maxValue: 99
});

const testObject = {
    name: 'Jo', // too short
    age: 15    // too young
};

const rules = [rule1, rule2];

const errors = validateFieldsOfObject(rules, testObject);
console.log('Test Errors:\n' + errors);

if (errors.includes("'Name' must be at least 3 characters in length.") && 
    errors.includes("'Age' must be greater than or equal to 18.")) {
    console.log('SUCCESS: Validation failed as expected with correct messages.');
} else {
    console.log('FAILURE: Validation did not produce expected messages.');
    process.exit(1);
}

const validObject = {
    name: 'John Doe',
    age: 25
};

const noErrors = validateFieldsOfObject(rules, validObject);
if (noErrors === "") {
    console.log('SUCCESS: Valid object passed validation.');
} else {
    console.log('FAILURE: Valid object failed validation with message: ' + noErrors);
    process.exit(1);
}
