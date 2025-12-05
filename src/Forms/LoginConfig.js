import {
    USERNAME_VALIDATION,
    PASSWORD_VALIDATION } from "../Metadata/Domain.jsx";


export const queryParameterConfig = [
    USERNAME_VALIDATION.appendGridFieldOptions( { 'restName' : "userName" } ),
    PASSWORD_VALIDATION.appendGridFieldOptions( { 'restName' : "password" } )
];

