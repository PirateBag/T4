import {
    COST_VALIDATION,
    DESCRIPTION_VALIDATION,
    ID_VALIDATION, LEAD_TIME_VALIDATION, MAX_DEPTH_VALIDATION, QUANTITY_VALIDATION,
    SOURCING_VALIDATION
} from "../Metadata/Domain.jsx";

export const ItemQueryRequestEditableMetadata = [
    ID_VALIDATION.appendGridFieldOptions( { 'editable': true } ),
    DESCRIPTION_VALIDATION.appendGridFieldOptions({ 'editable': true } ),
    COST_VALIDATION.appendGridFieldOptions({ 'editable': true } ),
    SOURCING_VALIDATION.appendGridFieldOptions({ 'editable': true } ),
    MAX_DEPTH_VALIDATION.appendGridFieldOptions({ 'editable': true } ),
    LEAD_TIME_VALIDATION.appendGridFieldOptions({ 'editable': true } ),
    QUANTITY_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'On Hand'} )
];

export const ItemQueryRequestCrudInsertMetadata = [
    ID_VALIDATION.appendGridFieldOptions( { 'editable': false } ),
    DESCRIPTION_VALIDATION.appendGridFieldOptions({ 'editable': true } ),
    COST_VALIDATION.appendGridFieldOptions({ 'editable': true } ),
    SOURCING_VALIDATION.appendGridFieldOptions({ 'editable': true } ),
    MAX_DEPTH_VALIDATION.appendGridFieldOptions({ 'editable': false } ),
    LEAD_TIME_VALIDATION.appendGridFieldOptions({ 'editable': true } ),
    QUANTITY_VALIDATION.appendGridFieldOptions({ 'editable': false, 'headerName': 'On Hand'} )
];


export const ItemQueryResultsMetadata  = [
    ID_VALIDATION.appendGridFieldOptions(  { 'editable': false, 'headerName': 'Id'  } ),
    DESCRIPTION_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'Description', width: 300 } ),
    COST_VALIDATION.appendGridFieldOptions( { 'editable': true, 'headerName': 'Unit Cost', width: 115 } ),
    SOURCING_VALIDATION.appendGridFieldOptions( { 'editable': true, 'headerName': 'Source', width: 100 } ),
    MAX_DEPTH_VALIDATION.appendGridFieldOptions( { 'editable': false, 'headerName': 'Depth', width: 100 } ),
    LEAD_TIME_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'Lead Time', width: 125 }   ),
    QUANTITY_VALIDATION.appendGridFieldOptions( { 'editable': false, 'headerName': 'On Hand', width: 125 } )
    ];

