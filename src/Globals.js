import {
    COST_VALIDATION,
    DESCRIPTION_VALIDATION,
    ID_VALIDATION, LEAD_TIME_VALIDATION,
    MAX_DEPTH_VALIDATION, QUANTITY_VALIDATION,
    SOURCING_VALIDATION
} from "./Metadata/Domain.jsx";

export const ApplicationName = "INMAN T4";

/** Constants for creating requests and their URLs.  */

/*  Login  */
export const VerifyCredentialsUrl = 'http://localhost:8080/verifyCredentials';


/*  Item related.  */
export const itemQueryUrl = 'http://localhost:8080/item/crudQuery'
export const itemCrudRequestTemplate = '{ "updatedRows" : [ ${rowWithQuery} ] }';
export const itemUpdateUrl = 'http://localhost:8080/item/crud'
export const itemMasterReportUrl = 'http://localhost:8080/itemReport/showAllItems'
export const itemExplosionReportUrl = 'http://localhost:8080/itemReport/explosion';
export const itemMaxLevelReportUrl = 'http://localhost:8080/itemReport/calculateMaxDepth';
export const itemQueryAll = { "updatedRows" : [  ] };
export const bomComponents = "http://localhost:8080/bom/findByParent";
export const bomWhereUsed = "http://localhost:8080/bom/findByChild";
export const bomCrudUrl  = "http://localhost:8080/bom/crud";

//  Uses GenericSingleIdDto
export const itemPickAll = 'itemPick/all';
export const itemPickForBom = 'itemPick/itemsForBom';
export const pickListRequestTemplate = '{ ${rowWithQuery} }';
export const pickListUpdateUrl = 'http://localhost:8080/itemPick/crud';

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

