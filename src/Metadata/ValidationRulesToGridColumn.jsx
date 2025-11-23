
import { VALIDATION_RULES } from './Domain.jsx';

/**
 * Converts validation rules to GridColDef array for Material-UI DataGrid
 * @returns {Array} Array of GridColDef objects
 */
export const getGridColumns = () => {
    return VALIDATION_RULES.map(rule => ({
        field: rule.fieldName,
        headerName: rule.defaultHeader,
        width: rule.defaultWidthInCharacters * 11+2,
        editable: true,
        type: rule.type,
        valueOptions: rule.valueOptions,
        ...(rule.type === 'number' && {
            valueParser: (value) => Number(value),
        }),
    }));
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