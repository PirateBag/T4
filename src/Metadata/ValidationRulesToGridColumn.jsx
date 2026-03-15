
import { VALIDATION_RULES } from './Domain.jsx';

/**
 * Converts validation rules to GridColDef array for Material-UI DataGrid
 * @returns {Array} Array of GridColDef objects
 */
export const getGridColumns = () => {
    return VALIDATION_RULES.map(rule => ({
        domainName: rule.domainName,
        headerName: rule.defaultHeader,
        width: rule.defaultWidthInCharacters * 11+2,
        editable: true,
        type: rule.type,
        valueOptions: rule.valueOptions,
        defaultValue: rule.defaultValue,
        label : 'abc',
        ...(rule.type === 'number' && {
            valueParser: (value) => Number(value),
        }),
    }));
};
