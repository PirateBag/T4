
import { VALIDATION_RULES } from './Domain.jsx';


/**
 * Converts validation rules to GridColDef array for Material-UI DataGrid
 * @returns {Array} Array of GridColDef objects
 */
export const getGridColumns = () => {
    return VALIDATION_RULES.map(rule => ({
        field: rule.fieldName,
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