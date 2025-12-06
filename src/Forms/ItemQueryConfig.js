import {
    COST_VALIDATION,
    DESCRIPTION_VALIDATION,
    ID_VALIDATION, LEAD_TIME_VALIDATION, MAX_DEPTH_VALIDATION, QUANTITY_VALIDATION,
    SOURCING_VALIDATION
} from "../Metadata/Domain.jsx";

export const queryParameterConfig = [
    ID_VALIDATION.appendGridFieldOptions( { 'editable': false } ),
    DESCRIPTION_VALIDATION.appendGridFieldOptions(DESCRIPTION_VALIDATION, { 'editable': false } ),
    COST_VALIDATION.appendGridFieldOptions(COST_VALIDATION, { 'editable': false } ),
    SOURCING_VALIDATION.appendGridFieldOptions(SOURCING_VALIDATION, { 'editable': false } ),
    MAX_DEPTH_VALIDATION.appendGridFieldOptions(MAX_DEPTH_VALIDATION, { 'editable': false } ),
    LEAD_TIME_VALIDATION.appendGridFieldOptions(LEAD_TIME_VALIDATION, { 'editable': false } ),
    QUANTITY_VALIDATION.appendGridFieldOptions(QUANTITY_VALIDATION, { 'editable': false } )
];

export const queryResultsConfig  = [
    ID_VALIDATION.appendGridFieldOptions(  { 'editable': false, 'headerName': 'Id'  } ),
    DESCRIPTION_VALIDATION.appendGridFieldOptions({ 'editable': false, 'headerName': 'Description', width: 300 } ),
    COST_VALIDATION.appendGridFieldOptions( { 'editable': false, 'headerName': 'Unit Cost', width: 115 } ),
    SOURCING_VALIDATION.appendGridFieldOptions( { 'editable': false, 'headerName': 'Source', width: 100 } ),
    MAX_DEPTH_VALIDATION.appendGridFieldOptions( { 'editable': false, 'headerName': 'Depth', width: 100 } ),
    LEAD_TIME_VALIDATION.appendGridFieldOptions({ 'editable': false, headerName: 'Lead Time', width: 125 }   ),
    QUANTITY_VALIDATION.appendGridFieldOptions( { 'editable': false, headerName: 'On Hand', width: 125 } )
    ];

