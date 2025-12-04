import {
    USERNAME_VALIDATION,
    PASSWORD_VALIDATION } from "../Metadata/Domain.jsx";


/**
 * Given a domainName which references a validation rule, return a GridColDef object with the specified options.
 * @param validationRule
 * @param girdfieldOption
 * @returns {*}
 */
export function validationRulePlusGirdFieldOptions( validationRule, girdfieldOption ) {
    //      console.log( "validationRulePlusGird " + validationRule.domainName );
    return { ...validationRule, ...girdfieldOption };
}

export const queryParameterConfig = [
    validationRulePlusGirdFieldOptions(USERNAME_VALIDATION, { 'restName' : "userName" } ),
    validationRulePlusGirdFieldOptions(PASSWORD_VALIDATION, { 'restName' : "password" } )
];

