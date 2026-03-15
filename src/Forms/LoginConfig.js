import {
    USERNAME_VALIDATION,
    PASSWORD_VALIDATION } from "../Metadata/Domain.jsx";


export const LoginRequestEditableMetadata = [
    USERNAME_VALIDATION.appendGridFieldOptions( { 'restName' : "userName", editable: true } ),
    PASSWORD_VALIDATION.appendGridFieldOptions( { 'restName' : "password", editable: true } )
];

