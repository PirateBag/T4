import {
    COST_VALIDATION, CRUD_VALIDATION,
    DESCRIPTION_VALIDATION,
    ID_VALIDATION, LEAD_TIME_VALIDATION, MAX_DEPTH_VALIDATION, QUANTITY_VALIDATION,
    SOURCING_VALIDATION
} from "../Metadata/Domain.jsx";
import {REQUIRED_ADD, REQUIRED_NONE} from "../Metadata/ValidationRuleConstants.js";

export const ItemQueryRequestEditableMetadata = [
    ID_VALIDATION.appendGridFieldOptions( { 'editable': true } ),
    DESCRIPTION_VALIDATION.appendGridFieldOptions({ 'editable': true } ),
    COST_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'Unit Cost' } ),
    SOURCING_VALIDATION.appendGridFieldOptions({ 'editable': true } ),
    MAX_DEPTH_VALIDATION.appendGridFieldOptions({ 'editable': true } ),
    LEAD_TIME_VALIDATION.appendGridFieldOptions({ 'editable': true } ),
    QUANTITY_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'On Hand'} )
];

export const ItemQueryRequestCrudInsertMetadata = [
    //  ID not even allowed for Insert.
    //  ID_VALIDATION.appendGridFieldOptions( { 'editable': false, hidden: true, whenRequired: REQUIRED_NONE } ),
    DESCRIPTION_VALIDATION.appendGridFieldOptions({ 'editable': true, whenRequired: REQUIRED_ADD } ),
    COST_VALIDATION.appendGridFieldOptions({ 'editable': true,'headerName': 'Unit Cost', whenRequired: REQUIRED_ADD } ),
    SOURCING_VALIDATION.appendGridFieldOptions({ 'editable': true, whenRequired: REQUIRED_ADD } ),
    //  Not allowed for Insert.
    //  MAX_DEPTH_VALIDATION.appendGridFieldOptions({ 'editable': false, whenRequired: REQUIRED_NONE } ),
    LEAD_TIME_VALIDATION.appendGridFieldOptions({ 'editable': true, whenRequired: REQUIRED_ADD } ),
    //  On Hand not allowed for Insert.
    //  QUANTITY_VALIDATION.appendGridFieldOptions({ 'editable': false, 'headerName': 'On Hand',whenRequired: REQUIRED_NONE} ),
    CRUD_VALIDATION.appendGridFieldOptions( { 'editable': false, 'hidden': 'true'} )

];
export const ItemQueryRequestCrudDeleteMetadata = [
    ID_VALIDATION.appendGridFieldOptions( { 'editable': false, hidden: true, whenRequired: REQUIRED_NONE } ),
    DESCRIPTION_VALIDATION.appendGridFieldOptions({ 'editable': false, whenRequired: REQUIRED_ADD } ),
    COST_VALIDATION.appendGridFieldOptions({ 'editable': false,'headerName': 'Unit Cost', whenRequired: REQUIRED_ADD } ),
    SOURCING_VALIDATION.appendGridFieldOptions({ 'editable': false, whenRequired: REQUIRED_ADD } ),
    MAX_DEPTH_VALIDATION.appendGridFieldOptions({ 'editable': false, whenRequired: REQUIRED_NONE } ),
    LEAD_TIME_VALIDATION.appendGridFieldOptions({ 'editable': false, whenRequired: REQUIRED_ADD } ),
    QUANTITY_VALIDATION.appendGridFieldOptions({ 'editable': false, 'headerName': 'On Hand',whenRequired: REQUIRED_NONE} ),
    CRUD_VALIDATION.appendGridFieldOptions( { 'editable': false, 'hidden': 'true'} )
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

