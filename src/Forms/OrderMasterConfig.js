import {
    CHECKBOX_VALIDATION,
    DATE_VALIDATION,
    ID_VALIDATION, ORDER_STATE_VALIDATION,
    ORDER_TYPE_VALIDATION, QUANTITY_VALIDATION
} from "../Metadata/Domain.jsx";



//  id, quantityOrdered, quantityAssigned, startDate,completeDate, parentOliId,orderState, orderType
export const OrderQueryRequestEditableMetadata = [
    ID_VALIDATION.appendGridFieldOptions( { 'editable': true, 'headerName' : 'Line', 'field' : 'lineNo', 'width' : 95 } ),
    ID_VALIDATION.appendGridFieldOptions( { 'editable': true, 'headerName' : 'Order','width' : 100 } ),
    ID_VALIDATION.appendGridFieldOptions( { 'editable': true , 'field' : 'itemId', 'headerName': 'Item', 'useSelect': true, 'width' : 130 } ),
    QUANTITY_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'Ordered', 'field' : 'quantityOrdered', 'width' : 125 } ),
    QUANTITY_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'Assigned', 'field' : 'quantityAssigned', 'width' : 125 } ),
    DATE_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'Start', 'field' : 'startDate', 'width' : 130 } ),
    DATE_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'Complete', 'field' : 'completeDate','width' : 130 } ),
    ID_VALIDATION.appendGridFieldOptions( { 'editable': true , 'field' : 'parentOliId', 'headerName': 'Parent Order','width' : 135 } ),
    ORDER_STATE_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'State', 'field' : 'orderState', 'width' : 120 } ),
    ORDER_TYPE_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'Type', 'field' : 'orderType', 'width' : 120 } )
];


export const OrderLineItemResultsEditableMetaData = [
    ID_VALIDATION.appendGridFieldOptions( { 'headerName' : 'Order', 'width' : 100, 'field' : 'id', 'clickable' : true  } ),
    CHECKBOX_VALIDATION.appendGridFieldOptions( { 'editable': true, 'headerName' : 'Delete?', 'width' : 95, 'field' : 'delete', 'clickable' : true  } ),
    ID_VALIDATION.appendGridFieldOptions( { 'editable': true , 'headerName' : 'Item', 'width' : 100, 'field' : 'itemId', 'useSelect': true   } ),
    QUANTITY_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'Ordered', 'field' : 'quantityOrdered', 'width' : 120 } ),
    QUANTITY_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'Assigned', 'field' : 'quantityAssigned', 'width' : 120 } ),
    DATE_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'Start Date', 'field' : 'startDate', 'width' : 130 } ),
    DATE_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'Complete Date', 'field' : 'completeDate', width : 145} ),
    ID_VALIDATION.appendGridFieldOptions( { 'field' : 'parentOliId', 'headerName': 'Parent Order', width : 130 } ),
    ORDER_STATE_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'State', 'field' : 'orderState'} ),
    ORDER_TYPE_VALIDATION.appendGridFieldOptions({  'headerName': 'Type', 'field' : 'orderType' } )
];

export const OrderLineItemResultsEditableMetaDataV2 = [
    ID_VALIDATION.appendGridFieldOptions( { 'headerName' : 'Order', 'width' : 1, 'field' : 'id', 'clickable' : true  } ),
    ID_VALIDATION.appendGridFieldOptions( { 'editable': true , 'headerName' : 'Item', 'width' : 100, 'field' : 'itemId', 'useSelect': true   } ),
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
    CHECKBOX_VALIDATION.appendGridFieldOptions( { 'editable': true, 'headerName' : 'Delete?', 'width' : 95, 'field' : 'delete', 'clickable' : true  } ),
    ID_VALIDATION.appendGridFieldOptions( { 'editable': true , 'headerName' : 'Item', 'width' : 100, 'field' : 'itemId', 'useSelect': true   } ),
    QUANTITY_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'Ordered', 'field' : 'quantityOrdered', 'width' : 120 } ),
    QUANTITY_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'Assigned', 'field' : 'quantityAssigned', 'width' : 120 } ),
    DATE_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'Start Date', 'field' : 'startDate', 'width' : 130} ),
    DATE_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'Complete Date', 'field' : 'completeDate', width : 145 } ),
    ID_VALIDATION.appendGridFieldOptions( { 'field' : 'parentOliId', 'headerName': 'Parent Order', width : 130 } ),
    ORDER_STATE_VALIDATION.appendGridFieldOptions({ 'editable': true, 'headerName': 'State', 'field' : 'orderState' } ),
    ORDER_TYPE_VALIDATION.appendGridFieldOptions({  'headerName': 'Type', 'field' : 'orderType' } )
];