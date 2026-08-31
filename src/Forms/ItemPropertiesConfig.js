import {
    COST_VALIDATION,
    CRUD_VALIDATION,
    DESCRIPTION_VALIDATION,
    ID_VALIDATION,
    LEAD_TIME_VALIDATION,
    MAX_DEPTH_VALIDATION,
    QUANTITY_VALIDATION,
    SOURCING_VALIDATION
} from "../Metadata/Domain.jsx";
import {REQUIRED_ADD, REQUIRED_NONE} from "../Metadata/ValidationRuleConstants.js";


export const ItemDtoToString = (item) => item.id + "," + item.description;
export const ItemDtoToStringWithOperation = (item) => "Updated: " + ItemDtoToString(item);


export const ParentItemRules = [
    ID_VALIDATION.appendGridFieldOptions( { 'editable': false } ),
    DESCRIPTION_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName' : 'Description' } ),
    COST_VALIDATION.appendGridFieldOptions({ 'editable': true,'headerName': 'Unit Cost', whenRequired: REQUIRED_ADD } ),
    SOURCING_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName' : 'Sourcing', whenRequired: REQUIRED_ADD } ),
    LEAD_TIME_VALIDATION.appendGridFieldOptions({ 'editable': true, headerName : 'Lead Time', whenRequired: REQUIRED_ADD } ),
    CRUD_VALIDATION.appendGridFieldOptions( { 'editable': false, 'hidden': 'true'} )
];


export const BomComponentsDto = [
    ID_VALIDATION.appendGridFieldOptions({field: 'id', 'editable': false, 'headerName': 'Id'}),
    ID_VALIDATION.appendGridFieldOptions({field: 'childId', 'editable': true, 'headerName': 'Child Id', width: 300, useSelect: true}),
    DESCRIPTION_VALIDATION.appendGridFieldOptions({
        field: 'childDescription',
        'editable': false,
        'headerName': 'Description',
        width: 300,
        focusable: false
    }),
    QUANTITY_VALIDATION.appendGridFieldOptions({field: 'quantityPer', 'editable': true, width: 135}),
    COST_VALIDATION.appendGridFieldOptions({field: 'unitCost', editable: false, 'headerName': 'Unit Cost', width: 115}),
    COST_VALIDATION.appendGridFieldOptions({
        field: 'extendedCost',
        editable: false,
        'headerName': 'Extended Cost',
        width: 115
    })
]

export const BomParentsDto = [
    ID_VALIDATION.appendGridFieldOptions({field: 'id', 'editable': false, 'headerName': 'Id'}),
    ID_VALIDATION.appendGridFieldOptions({field: 'parentId', 'editable': true, 'headerName': 'Parent Id', width: 100}),
    DESCRIPTION_VALIDATION.appendGridFieldOptions({
        field: 'parentDescription',
        'editable': false,
        'headerName': 'Description',
        width: 300,
        focusable: false
    }),
    QUANTITY_VALIDATION.appendGridFieldOptions({field: 'quantityPer', 'editable': true, width: 135}),
    COST_VALIDATION.appendGridFieldOptions({field: 'unitCost', editable: false, 'headerName': 'Unit Cost', width: 115}),
    COST_VALIDATION.appendGridFieldOptions({
        field: 'extendedCost',
        editable: false,
        'headerName': 'Extended Cost',
        width: 115
    })
]
export const BomDtoToString = (bom) => bom.id + ":" + bom.parentId + ":" + bom.parentDescription + "," + bom.childId + ":" + bom.childDescription + ","
    + bom.quantityPer + "," + bom.unitCost + "," + bom.extendedCost;
