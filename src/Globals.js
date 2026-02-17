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
export const itemQueryAll = { "updatedRows" : [  ] };
export const bomFindItemParameters = "http://localhost:8080/bom/findItemParameters";
export const bomCrudUrl  = "http://localhost:8080/bom/crud";

export const ItemQueryParameterConfig = [
    ID_VALIDATION.appendGridFieldOptions( { 'editable': false } ),
    DESCRIPTION_VALIDATION.appendGridFieldOptions(DESCRIPTION_VALIDATION, { 'editable': false } ),
    COST_VALIDATION.appendGridFieldOptions(COST_VALIDATION, { 'editable': false } ),
    SOURCING_VALIDATION.appendGridFieldOptions(SOURCING_VALIDATION, { 'editable': false } ),
    MAX_DEPTH_VALIDATION.appendGridFieldOptions(MAX_DEPTH_VALIDATION, { 'editable': false } ),
    LEAD_TIME_VALIDATION.appendGridFieldOptions(LEAD_TIME_VALIDATION, { 'editable': false } ),
    QUANTITY_VALIDATION.appendGridFieldOptions(QUANTITY_VALIDATION, { 'editable': false } )
];

