import {
    COST_VALIDATION,
    DESCRIPTION_VALIDATION,
    ID_VALIDATION, LEAD_TIME_VALIDATION,
    MAX_DEPTH_VALIDATION, QUANTITY_VALIDATION,
    SOURCING_VALIDATION
} from "./Metadata/Domain.jsx";

export const ApplicationName = "INMAN T4";

/** Constants for creating requests and their URLs.  */

export const adjustmentCrudUrl = 'http://localhost:8080/adjustment/crud';
export const adjustmentQueryUrl = 'http://localhost:8080/adjustment/query';
export const balanceProjectionUrl = 'http://localhost:8080/ap/inventoryBalanceProjection';
export const bomComponents = "http://localhost:8080/bom/findByParent";
export const bomCrudUrl  = "http://localhost:8080/bom/crud";
export const bomWhereUsed = "http://localhost:8080/bom/findByChild";
export const clearItemBalances = 'http://localhost:8080/clear/itemBalances';
export const clearOrdersUrl = 'http://localhost:8080/clearAllData';
export const itemExplosionReportUrl = 'http://localhost:8080/itemReport/explosion';
export const itemMasterReportUrl = 'http://localhost:8080/itemReport/showAllItems'
export const itemMaxLevelReportUrl = 'http://localhost:8080/itemReport/calculateMaxDepth';
export const itemPickAllUrl = 'http://localhost:8080/itemPick/all';
export const itemPickForBom = 'itemPick/itemsForBom';
export const itemQueryUrl = 'http://localhost:8080/item/crudQuery'
export const itemCrudUrl = 'http://localhost:8080/item/crud'
export const orderLineItemCrudUrl =  "http://localhost:8080/oli/crud";
export const orderLineItemQueryUrl =  "http://localhost:8080/oli/query";
export const planAllUrl = 'http://localhost:8080/ap/basic';
export const VerifyCredentialsUrlV2 = 'http://localhost:8080/credentials';

export const olderEmptyQueryConstant = { "updatedRows" : [  ] };
export const newEmptyQueryConstant = { "rows" : [  ] };



//  Uses GenericSingleIdDto
export const genericSingleRequest = { "idToSearchFor" : "1" };

export const ItemQueryParameterConfig = [
    ID_VALIDATION.appendGridFieldOptions( { 'editable': false } ),
    DESCRIPTION_VALIDATION.appendGridFieldOptions({ 'editable': false } ),
    COST_VALIDATION.appendGridFieldOptions({ 'editable': false } ),
    SOURCING_VALIDATION.appendGridFieldOptions({ 'editable': false } ),
    MAX_DEPTH_VALIDATION.appendGridFieldOptions({ 'editable': false } ),
    LEAD_TIME_VALIDATION.appendGridFieldOptions({ 'editable': false } ),
    QUANTITY_VALIDATION.appendGridFieldOptions({ 'editable': false } )
];


export const GenericSingleIdDto = [
    ID_VALIDATION.appendGridFieldOptions( { 'editable': false } ),
    DESCRIPTION_VALIDATION.appendGridFieldOptions({ field: 'options', 'editable': false } ),
];

