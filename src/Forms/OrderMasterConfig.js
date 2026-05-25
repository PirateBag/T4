import {
    CHECKBOX_VALIDATION,
    DATE_VALIDATION,
    ID_VALIDATION, ORDER_STATE_VALIDATION,
    ORDER_TYPE_VALIDATION, QUANTITY_VALIDATION
} from "../Metadata/Domain.jsx";
import {REQUIRED_ADD, REQUIRED_NONE} from "../Metadata/ValidationRuleConstants.js";


//  id, quantityOrdered, quantityAssigned, startDate,completeDate, parentOliId,orderState, orderType
export const OrderQueryRequestEditableMetadata = [
    ID_VALIDATION.appendGridFieldOptions( { 'editable': true, 'headerName' : 'Order' } ),
    ID_VALIDATION.appendGridFieldOptions( { 'editable': true , 'field' : 'itemId', 'headerName': 'Item' } ),
    QUANTITY_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'Quantity Ordered', 'field' : 'quantityOrdered' } ),
    QUANTITY_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'Quantity Assigned', 'field' : 'quantityAssigned' } ),
    DATE_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'Start Date', 'field' : 'startDate' } ),
    DATE_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'Complete Date', 'field' : 'completeDate' } ),
    ID_VALIDATION.appendGridFieldOptions( { 'editable': true , 'field' : 'parentOliId', 'headerName': 'Parent Order' } ),
    ORDER_STATE_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'Order State', 'field' : 'orderState' } ),
    ORDER_TYPE_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'Order Type', 'field' : 'orderType' } )

];


export const OrderLineItemResultsEditableMetaData = [
    ID_VALIDATION.appendGridFieldOptions( { 'headerName' : 'Order', 'width' : 100, 'field' : 'id', 'clickable' : true  } ),
    CHECKBOX_VALIDATION.appendGridFieldOptions( { 'editable': true, 'headerName' : 'Delete?', 'width' : 95, 'field' : 'delete', 'clickable' : true  } ),
    ID_VALIDATION.appendGridFieldOptions( { 'editable': false , 'headerName' : 'Item', 'width' : 100, 'field' : 'itemId'   } ),
    QUANTITY_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'Ordered', 'field' : 'quantityOrdered', 'width' : 120 } ),
    QUANTITY_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'Assigned', 'field' : 'quantityAssigned', 'width' : 120 } ),
    DATE_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'Start Date', 'field' : 'startDate', 'width' : 130 } ),
    DATE_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'Complete Date', 'field' : 'completeDate', width : 145} ),
    ID_VALIDATION.appendGridFieldOptions( { 'field' : 'parentOliId', 'headerName': 'Parent Order', width : 130 } ),
    ORDER_STATE_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'State', 'field' : 'orderState'} ),
    ORDER_TYPE_VALIDATION.appendGridFieldOptions({  'headerName': 'Type', 'field' : 'orderType' } )
];

export const OrderLineItemComponentResultsMetaData = [
    ID_VALIDATION.appendGridFieldOptions( { 'headerName' : 'Order', 'width' : 100, 'field' : 'id'  } ),
    ID_VALIDATION.appendGridFieldOptions( { 'editable': false , 'headerName' : 'Item', 'width' : 100, 'field' : 'itemId'   } ),
    QUANTITY_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'Ordered', 'field' : 'quantityOrdered', 'width' : 140 } ),
    QUANTITY_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'Assigned', 'field' : 'quantityAssigned', 'width' : 140 } ),
    DATE_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'Start Date', 'field' : 'startDate', 'width' : 135 } ),
    DATE_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'Complete Date', 'field' : 'completeDate', width : 150} ),
    ID_VALIDATION.appendGridFieldOptions( { 'field' : 'parentOliId', 'headerName': 'Parent Order', width : 130 } ),
    ORDER_STATE_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'State', 'field' : 'orderState', width:130 } ),
    ORDER_TYPE_VALIDATION.appendGridFieldOptions({  'headerName': 'Type', 'field' : 'orderType' } )
];