import {
    COST_VALIDATION, CRUD_VALIDATION,
    DESCRIPTION_VALIDATION,
    ID_VALIDATION, LEAD_TIME_VALIDATION, MAX_DEPTH_VALIDATION, QUANTITY_VALIDATION,
    SOURCING_VALIDATION
} from "../Metadata/Domain.jsx";

/** Maps to an Item (Used in ItemCrud APIs), with widths adjusted for use in data grids.  */
export const BomComponentsDto = [
    ID_VALIDATION.appendGridFieldOptions(  { field: 'parentId', 'editable': true, 'headerName': 'Parent Id', width: 100  } ),
     ID_VALIDATION.appendGridFieldOptions(  { field: 'childId', 'editable': true, 'headerName': 'Child Id', width: 100  } ),
        DESCRIPTION_VALIDATION.appendGridFieldOptions({ field: 'parentDescription',  'editable': false, 'headerName': 'Parent Description', width: 300, focusable: false} ),
    DESCRIPTION_VALIDATION.appendGridFieldOptions({ field: 'childDescription',  'editable': false, 'headerName': 'Child description', width: 300, focusable: false} ),
    QUANTITY_VALIDATION.appendGridFieldOptions( { field: 'quantityPer', 'editable': true, width: 135 } ),
    CRUD_VALIDATION.appendGridFieldOptions( { field: 'crudAction', 'editable': false, headerName: 'Crud Action', hidden: true } ) ];
