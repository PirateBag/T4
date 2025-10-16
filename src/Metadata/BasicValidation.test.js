// src/Metadata/BasicValidation.test.js
import { describe, it, expect } from 'vitest';
import { ValidationRules, CaseConversion } from './BasicValidation.js';

describe('ValidationRules', () => {
    describe('Constructor - String validation', () => {
        it('should create a string validation rule with basic parameters', () => {
            const rule = new ValidationRules('username', 3, 20, CaseConversion.NONE, null);
            
            expect(rule.fieldName).toBe('username');
            expect(rule.minLength).toBe(3);
            expect(rule.maxLength).toBe(20);
            expect(rule.caseConversion).toBe(CaseConversion.NONE);
            expect(rule.type).toBe(String);
            expect(rule.preventThisValue).toBeNull();
        });

        it('should create a string validation rule with prevented value', () => {
            const rule = new ValidationRules('password', 8, 50, CaseConversion.NONE, 'default123');
            
            expect(rule.preventThisValue).toBe('default123');
        });
    });

    describe('Constructor - Numeric validation', () => {
        it('should create a numeric validation rule', () => {
            const rule = new ValidationRules('age', 0, 120, null);
            
            expect(rule.fieldName).toBe('age');
            expect(rule.minValue).toBe(0);
            expect(rule.maxValue).toBe(120);
            expect(rule.type).toBe(Number);
        });

        it('should create a numeric validation rule with negative range', () => {
            const rule = new ValidationRules('temperature', -50, 50, null);
            
            expect(rule.minValue).toBe(-50);
            expect(rule.maxValue).toBe(50);
        });
    });

    describe('Constructor - With values array', () => {
        it('should create a validation rule with allowed values', () => {
            const allowedValues = ['active', 'inactive', 'pending'];
            const rule = new ValidationRules('status', allowedValues, 0, 10, CaseConversion.NONE, 'default');
            
            expect(rule.fieldName).toBe('status');
            expect(rule.values).toEqual(allowedValues);
            expect(rule.minLength).toBe(0);
            expect(rule.maxLength).toBe(10);
            expect(rule.type).toBe(String);
        });
    });

    describe('reformatStringUsingRules', () => {
        it('should not modify string with NONE case conversion', () => {
            const rule = new ValidationRules('name', 0, 100, CaseConversion.NONE, null);
            
            expect(rule.reformatStringUsingRules('HelloWorld')).toBe('HelloWorld');
        });

        it('should convert to lowercase with LOWER case conversion', () => {
            const rule = new ValidationRules('email', 0, 100, CaseConversion.LOWER, null);
            
            expect(rule.reformatStringUsingRules('USER@EXAMPLE.COM')).toBe('user@example.com');
        });

        it('should convert to lowercase with LOWERCASE case conversion', () => {
            const rule = new ValidationRules('email', 0, 100, CaseConversion.LOWERCASE, null);
            
            expect(rule.reformatStringUsingRules('USER@EXAMPLE.COM')).toBe('user@example.com');
        });

        it('should convert to uppercase with UPPER case conversion', () => {
            const rule = new ValidationRules('code', 0, 10, CaseConversion.UPPER, null);
            
            expect(rule.reformatStringUsingRules('abc123')).toBe('ABC123');
        });

        it('should convert to uppercase with UPPERCASE case conversion', () => {
            const rule = new ValidationRules('code', 0, 10, CaseConversion.UPPERCASE, null);
            
            expect(rule.reformatStringUsingRules('abc123')).toBe('ABC123');
        });

        it('should trim whitespace with case conversion', () => {
            const rule = new ValidationRules('username', 0, 20, CaseConversion.LOWER, null);
            
            expect(rule.reformatStringUsingRules('  UserName  ')).toBe('username');
        });
    });

    describe('applyRulesToStringValue', () => {
        it('should return null for valid string', () => {
            const rule = new ValidationRules('username', 3, 20, CaseConversion.NONE, null);
            
            expect(rule.applyRulesToStringValue('validuser')).toBeNull();
        });

        it('should return error for string too short', () => {
            const rule = new ValidationRules('username', 5, 20, CaseConversion.NONE, null);
            
            const error = rule.applyRulesToStringValue('abc');
            expect(error).toContain('username');
            expect(error).toContain('at least 5 characters');
        });

        it('should return error for string too long', () => {
            const rule = new ValidationRules('username', 3, 10, CaseConversion.NONE, null);
            
            const error = rule.applyRulesToStringValue('thisstringiswaytoolong');
            expect(error).toContain('username');
            expect(error).toContain('must not exceed 10 characters');
        });

        it('should return error for prevented value', () => {
            const rule = new ValidationRules('username', 3, 20, CaseConversion.NONE, 'default');
            
            const error = rule.applyRulesToStringValue('default');
            expect(error).toContain('Please enter a value');
            expect(error).toContain('default is not sufficient');
        });

        it('should validate against allowed values', () => {
            const rule = new ValidationRules('status', ['active', 'inactive'], 0, 20, CaseConversion.NONE, null);
            
            expect(rule.applyRulesToStringValue('active')).toBeNull();
            expect(rule.applyRulesToStringValue('inactive')).toBeNull();
            
            const error = rule.applyRulesToStringValue('pending');
            expect(error).toContain('should be one of the following');
            expect(error).toContain('active,inactive');
        });

        it('should handle case conversion when validating allowed values', () => {
            const rule = new ValidationRules('status', ['ACTIVE', 'INACTIVE'], 0, 20, CaseConversion.UPPER, null);
            
            expect(rule.applyRulesToStringValue('active')).toBeNull();
            expect(rule.applyRulesToStringValue('ACTIVE')).toBeNull();
        });

        it('should return multiple errors when applicable', () => {
            const rule = new ValidationRules('code', 5, 10, CaseConversion.NONE, null);
            
            const error = rule.applyRulesToStringValue('abc');
            expect(error).toContain('at least 5 characters');
        });
    });

    describe('applyRulesToDoubleValue', () => {
        it('should return null for valid number', () => {
            const rule = new ValidationRules('age', 0, 120, null);
            
            expect(rule.applyRulesToDoubleValue(25)).toBeNull();
            expect(rule.applyRulesToDoubleValue(0)).toBeNull();
            expect(rule.applyRulesToDoubleValue(120)).toBeNull();
        });

        it('should return error for number too small', () => {
            const rule = new ValidationRules('age', 0, 120, null);
            
            const error = rule.applyRulesToDoubleValue(-5);
            expect(error).toContain('age');
            expect(error).toContain('greater than or equal to 0');
        });

        it('should return error for number too large', () => {
            const rule = new ValidationRules('age', 0, 120, null);
            
            const error = rule.applyRulesToDoubleValue(150);
            expect(error).toContain('age');
            expect(error).toContain('must not exceed 120');
        });

        it('should return error for invalid number', () => {
            const rule = new ValidationRules('age', 0, 120, null);
            
            const error = rule.applyRulesToDoubleValue('not a number');
            expect(error).toContain('must be a valid number');
        });

        it('should handle decimal values', () => {
            const rule = new ValidationRules('price', 0.01, 999.99, null);
            
            expect(rule.applyRulesToDoubleValue(19.99)).toBeNull();
            expect(rule.applyRulesToDoubleValue(0.01)).toBeNull();
            expect(rule.applyRulesToDoubleValue(999.99)).toBeNull();
        });

        it('should handle negative ranges', () => {
            const rule = new ValidationRules('temperature', -50, 50, null);
            
            expect(rule.applyRulesToDoubleValue(-25)).toBeNull();
            expect(rule.applyRulesToDoubleValue(25)).toBeNull();
            expect(rule.applyRulesToDoubleValue(-51)).not.toBeNull();
            expect(rule.applyRulesToDoubleValue(51)).not.toBeNull();
        });
    });

    describe('doesStringComplyWithRules', () => {
        it('should validate string and return null for valid input', () => {
            const rule = new ValidationRules('username', 3, 20, CaseConversion.NONE, null);
            
            expect(rule.doesStringComplyWithRules('validuser')).toBeNull();
        });

        it('should trim input before validation', () => {
            const rule = new ValidationRules('username', 3, 20, CaseConversion.NONE, null);
            
            expect(rule.doesStringComplyWithRules('  validuser  ')).toBeNull();
        });

        it('should return error for invalid input', () => {
            const rule = new ValidationRules('username', 5, 20, CaseConversion.NONE, null);
            
            const error = rule.doesStringComplyWithRules('ab');
            expect(error).not.toBeNull();
            expect(error).toContain('at least 5 characters');
        });
    });

    describe('validate', () => {
        it('should validate string type', () => {
            const rule = new ValidationRules('username', 3, 20, CaseConversion.NONE, null);
            
            expect(rule.validate('validuser')).toBeNull();
            expect(rule.validate('ab')).not.toBeNull();
        });

        it('should validate number type', () => {
            const rule = new ValidationRules('age', 0, 120, null);
            
            expect(rule.validate(25)).toBeNull();
            expect(rule.validate(150)).not.toBeNull();
        });

        it('should throw error for unsupported type', () => {
            const rule = new ValidationRules('field', 0, 10, CaseConversion.NONE, null);
            rule.type = Object; // Manually set to unsupported type
            
            expect(() => rule.validate('test')).toThrow('Cannot enforce rules on this type');
        });
    });

    describe('getListOfPermittedValues', () => {
        it('should return comma-separated list of values', () => {
            const rule = new ValidationRules('status', ['active', 'inactive', 'pending'], 0, 20, CaseConversion.NONE, null);
            
            expect(rule.getListOfPermittedValues()).toBe('active,inactive,pending');
        });

        it('should return null when no values provided', () => {
            const rule = new ValidationRules('username', 3, 20, CaseConversion.NONE, null);
            
            expect(rule.getListOfPermittedValues()).toBeNull();
        });

        it('should return null for non-string type', () => {
            const rule = new ValidationRules('age', 0, 120, null);
            rule.values = ['1', '2', '3']; // Manually set values
            
            expect(rule.getListOfPermittedValues()).toBeNull();
        });
    });

    describe('valuesAsString', () => {
        it('should return values array', () => {
            const allowedValues = ['active', 'inactive', 'pending'];
            const rule = new ValidationRules('status', allowedValues, 0, 20, CaseConversion.NONE, null);
            
            expect(rule.valuesAsString()).toEqual(allowedValues);
        });

        it('should return null when no values', () => {
            const rule = new ValidationRules('username', 3, 20, CaseConversion.NONE, null);
            
            expect(rule.valuesAsString()).toBeNull();
        });
    });

    describe('Edge cases', () => {
        it('should handle empty string validation', () => {
            const rule = new ValidationRules('field', 0, 100, CaseConversion.NONE, null);
            
            expect(rule.applyRulesToStringValue('')).toBeNull();
        });

        it('should handle zero as numeric value', () => {
            const rule = new ValidationRules('count', 0, 100, null);
            
            expect(rule.applyRulesToDoubleValue(0)).toBeNull();
        });

        it('should handle exact min/max length boundaries', () => {
            const rule = new ValidationRules('code', 5, 5, CaseConversion.NONE, null);
            
            expect(rule.applyRulesToStringValue('12345')).toBeNull();
            expect(rule.applyRulesToStringValue('1234')).not.toBeNull();
            expect(rule.applyRulesToStringValue('123456')).not.toBeNull();
        });

        it('should handle exact min/max value boundaries', () => {
            const rule = new ValidationRules('score', 0, 100, null);
            
            expect(rule.applyRulesToDoubleValue(0)).toBeNull();
            expect(rule.applyRulesToDoubleValue(100)).toBeNull();
            expect(rule.applyRulesToDoubleValue(-0.01)).not.toBeNull();
            expect(rule.applyRulesToDoubleValue(100.01)).not.toBeNull();
        });
    });
});
