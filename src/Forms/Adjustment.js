import {
    ADJUSTMENT_TYPE_VALIDATION,
    CRUD_VALIDATION,
    DATE_VALIDATION,
    ID_VALIDATION,
    ORDER_TYPE_VALIDATION, QUANTITY_VALIDATION
} from "../Metadata/Domain.jsx";

export const AdjustmentQueryMetadata = [
    ID_VALIDATION.appendGridFieldOptions( { 'editable': true, 'headerName' : 'Line', 'field' : 'lineNo' } ),
    ID_VALIDATION.appendGridFieldOptions( { 'editable': true , 'id' : 'id', 'headerName': 'Id', 'width' : 200 } ),
    QUANTITY_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'Amount', 'field' : 'amount' } ),
    ID_VALIDATION.appendGridFieldOptions( { 'editable': true , 'field' : 'itemId', 'headerName': 'Item', 'width' : 200 } ),
    ID_VALIDATION.appendGridFieldOptions( { 'editable': true, 'headerName' : 'Adjustment', 'field' : 'Adjustment' } ),
    ID_VALIDATION.appendGridFieldOptions( { 'editable': true, 'headerName' : 'Order', 'field' : 'orderId' } ),
    ORDER_TYPE_VALIDATION.appendGridFieldOptions({  'headerName': 'Type', 'field' : 'type' } ),
    DATE_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'Date', 'field' : 'effectiveDate' } )
 ];

export const AdjustmentRowMetadata = [
    ID_VALIDATION.appendGridFieldOptions( { 'editable': true , 'id' : 'id', 'headerName': 'Id', 'width' : 200 } ),
    QUANTITY_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'Amount', 'field' : 'amount' } ),
    ID_VALIDATION.appendGridFieldOptions( { 'editable': true , 'field' : 'itemId', 'headerName': 'Item', 'width' : 200 } ),
    ID_VALIDATION.appendGridFieldOptions( { 'editable': true, 'headerName' : 'Order', 'field' : 'orderId' } ),
    ORDER_TYPE_VALIDATION.appendGridFieldOptions({  'headerName': 'Type', 'field' : 'orderType' } ),
    DATE_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'Date', 'field' : 'effectiveDate' } ),
    ADJUSTMENT_TYPE_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'Type', 'field' : 'adjustmentType' } ),
    CRUD_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'Action', 'field' : 'crudAction' } ) ];
