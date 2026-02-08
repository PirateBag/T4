import {
    COST_VALIDATION, CRUD_VALIDATION,
    DESCRIPTION_VALIDATION,
    ID_VALIDATION, LEAD_TIME_VALIDATION, MAX_DEPTH_VALIDATION, QUANTITY_VALIDATION,
    SOURCING_VALIDATION
} from "../Metadata/Domain.jsx";

/** Maps to an Item (Used in ItemCrud APIs), with widths adjusted for use in data grids.  */
export const ItemRoDTO  = [
    ID_VALIDATION.appendGridFieldOptions(  { 'editable': false, 'headerName': 'Id'  } ),
    DESCRIPTION_VALIDATION.appendGridFieldOptions({ field: 'description', 'editable': true, 'headerName': 'Description' } ),
    COST_VALIDATION.appendGridFieldOptions( { field: 'unitCost', 'editable': true, 'headerName': 'Unit Cost'  } ),
    SOURCING_VALIDATION.appendGridFieldOptions( { field: 'sourcing', 'editable': true, 'headerName': 'Source', } ),
    MAX_DEPTH_VALIDATION.appendGridFieldOptions( { field: 'maxDepth', 'editable': false, 'headerName': 'Depth' } ),
    LEAD_TIME_VALIDATION.appendGridFieldOptions({ field: 'leadTime', 'editable': true, headerName: 'Lead Time' }   ),
    QUANTITY_VALIDATION.appendGridFieldOptions( { field: 'quantityOnHand', 'editable': false, headerName: 'On Hand' } ),
    CRUD_VALIDATION.appendGridFieldOptions( { field: 'crudAction', 'editable': false, headerName: 'Crud Action', hidden: true } )
    ];

export const ItemDtoToString = ( item ) => item.id + "," + item.description;
export const ItemDtoToStringWithOperation = (item ) => "Updated: " + ItemDtoToString( item );

export const BomComponentsDto = [
    ID_VALIDATION.appendGridFieldOptions(  { field: 'id', 'editable': false, 'headerName': 'Id'  } ),
    ID_VALIDATION.appendGridFieldOptions(  { field: 'childId', 'editable': true, 'headerName': 'Child Id', width: 100  } ),
    DESCRIPTION_VALIDATION.appendGridFieldOptions({ field: 'childDescription',  'editable': false, 'headerName': 'Description', width: 300, focusable: false} ),
    QUANTITY_VALIDATION.appendGridFieldOptions( { field: 'quantityPer', 'editable': true, width: 135 } ),
    COST_VALIDATION.appendGridFieldOptions( { field: 'unitCost', editable: false, 'headerName': 'Unit Cost', width: 115 } ),
    COST_VALIDATION.appendGridFieldOptions( { field: 'extendedCost', editable: false, 'headerName': 'Extended Cost', width: 115 } )
]
export const BomDtoToString = ( bom ) => bom.id + ":" + bom.parentId + ":" + bom.parentDescription + "," + bom.childId + ":" + bom.childDescription + ","
    + bom.quantityPer + "," + bom.unitCost + "," + bom.extendedCost;
