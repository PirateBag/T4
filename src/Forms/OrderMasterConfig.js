import {
    DATE_VALIDATION,
    ID_VALIDATION, ORDER_STATE_VALIDATION,
    ORDER_TYPE_VALIDATION, QUANTITY_VALIDATION
} from "../Metadata/Domain.jsx";
import {REQUIRED_ADD, REQUIRED_NONE} from "../Metadata/ValidationRuleConstants.js";


//  id, quantityOrdered, quantityAssigned, startDate,completeDate, parentOliId,orderState, orderType
export const OrderQueryRequestEditableMetadata = [
    ID_VALIDATION.appendGridFieldOptions( { 'editable': true } ),
    ID_VALIDATION.appendGridFieldOptions( { 'editable': false , 'field' : 'itemId', 'headerName': 'Item' } ),
    QUANTITY_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'Quantity Ordered', 'field' : 'quantityOrdered' } ),
    QUANTITY_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'Quantity Assigned', 'field' : 'quantityAssigned' } ),
    DATE_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'Start Date', 'field' : 'startDate' } ),
    DATE_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'Complete Date', 'field' : 'completeDate' } ),
    ID_VALIDATION.appendGridFieldOptions( { 'editable': true , 'field' : 'parentOliId', 'headerName': 'Parent Order' } ),
    ORDER_STATE_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'Order State', 'field' : 'orderState' } ),
    ORDER_TYPE_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'Order Type', 'field' : 'orderType' } )
];


export const OrderLineItemResultsEditableMetaData = [
    ID_VALIDATION.appendGridFieldOptions( { 'editable': true } ),
    ID_VALIDATION.appendGridFieldOptions( { 'editable': false , 'field' : 'Item' } ),
    QUANTITY_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'Quantity Ordered', 'field' : 'quantityOrdered' } ),
    QUANTITY_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'Quantity Assigned', 'field' : 'quantityAssigned' } ),
    DATE_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'Start Date', 'field' : 'startDate' } ),
    DATE_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'Complete Date', 'field' : 'completeDate' } ),
    ID_VALIDATION.appendGridFieldOptions( { 'editable': true , 'field' : 'parentOliId', 'headerName': 'Parent Order' } ),
    ORDER_STATE_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'Order State', 'field' : 'orderState' } ),
    ORDER_TYPE_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'Order Type', 'field' : 'orderType' } )
];