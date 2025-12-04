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
    ID_VALIDATION.appendGridFieldOptions(  { 'editable': false, 'headerName': 'Id', width: 200 } ),
    DESCRIPTION_VALIDATION.appendGridFieldOptions({ 'editable': false } ),
    COST_VALIDATION.appendGridFieldOptions( { 'editable': false } ),
    SOURCING_VALIDATION.appendGridFieldOptions( { 'editable': false } ),
    MAX_DEPTH_VALIDATION.appendGridFieldOptions( { 'editable': false } ),
    LEAD_TIME_VALIDATION.appendGridFieldOptions({ 'editable': false } ),
    QUANTITY_VALIDATION.appendGridFieldOptions( { 'editable': false } )
    ];

