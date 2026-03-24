import axios from "axios";
import {validateFieldsOfObject} from "./Metadata/ValidateRule.js";
import {CRUD_ACTION_NONE} from "./crudAction.js";

export const isShallowEqual = (obj1, obj2) => {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) return false;
    return keys1.every(key => obj1[key] === obj2[key]);
};

export function extractMessageFromResponse(response) {

    let rValue = "";
    const errors = response?.data?.errors ?? [];
    errors.map((error) => rValue += error.message + "\n");
    return rValue;
}

class FormService {
    constructor(options) {
        this.messagesFromForm = options.messagesFromForm;
        this.messageFormSetter = options.messageFormSetter;
        this.afterPostCallback = options.afterPostCallback ?? (() => {});
        this.onErrorCallback = options.onErrorCallback ?? (() => {});
        this.requestTemplate = options.requestTemplate;
        this.validationRules = options.validationRules ?? [];
    }


    /**
     * Pull all object entries from a form and return as an object.
     * @param event
     * @returns {{[p: string]: unknown}}
     */
    setCrudActionInObject( source, crudAction ) {
        source.crudAction = crudAction;
        console.log( "Object with Crud Action is '" + source + "'" );
        return source;
    }



    handleBlurOnTextField( event, validationRule ) {
        const valueToValidate = event.target.value.trim();
        if (validationRule.required && valueToValidate === '') {
            this.messageFormSetter("${validationRule.field} is a required field." );
            return;
        }
        const message = validationRule.validate(valueToValidate);
        this.messageFormSetter( message );
    }

    formatErrorMessage(error) {
        if (error.code === 'ERR_NETWORK' || !error.response) {
            return "Network error code " + error;
        }

        // HTTP error with response
        if (error.response) {
            const status = error.response.status;
            const data = error.response.data;

            // Check if the server sent a message
            if (data?.message) {
                return data.message;
            }

            // Handle common HTTP status codes
            switch (status) {
                case 400:
                    return "Invalid request. Please check your input.";
                case 401:
                    return "Authentication failed. Please check your credentials.";
                case 403:
                    return "Access denied. You don't have permission.";
                case 404:
                    return "Resource not found.";
                case 409:
                    return "Conflict. This resource already exists.";
                case 500:
                    return "Server error. Please try again later.";
                case 503:
                    return "Service unavailable. Please try again later.";
                default:
                    return `Error: ${status}. Please try again.`;
            }
        }

        // Generic error
        return error.message || "An unexpected error occurred. Please try again.";
    }

    copyObjectRemovingEmptyStrings(objectToCopy) {
        return Object.fromEntries(
            Object.entries(objectToCopy).filter(([, value]) =>
                value !== null &&
                value !== undefined &&
                value !== ""
            )
        )
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        let messagesFromFormValidation = "";
        this.messageFormSetter(messagesFromFormValidation);

        if (messagesFromFormValidation.length > 0) return;

        const queryParametersFromForm = this.extractRequestAsObject(event);


        messagesFromFormValidation = validateFieldsOfObject(this.validationRules, queryParametersFromForm)
        if (messagesFromFormValidation.length > 0) {
            this.messageFormSetter(messagesFromFormValidation);
            return
        }

        const requestPriorToCrudAction = this.singleRowToRequest( this.requestObject ?? queryParametersFromForm);
        const finalRequestAsObject = this.setCrudActionInObject( requestPriorToCrudAction, event.nativeEvent.submitter.value ?? CRUD_ACTION_NONE );

        console.log( "Final request prior to CrudAction:", finalRequestAsObject );
        console.log( "submitter value:", event.nativeEvent.submitter.value );
        const overrideForCrudAction = event.nativeEvent.submitter.value ?? "";
        if ( overrideForCrudAction !== "" ) {
            finalRequestAsObject.updatedRows[ 0 ].crudAction = overrideForCrudAction;
            console.log( "CrudAction updated top  '" + finalRequestAsObject.updatedRows[ 0 ].crudAction + "'" );
        }
        console.log( "Final Request after Crud action: '" + finalRequestAsObject + "'" );
        await this.postData(finalRequestAsObject, event.nativeEvent.submitter.name );
    }


    /**
     * Pull all object entries from a form and return as an object.
     * @param event
     * @returns {{[p: string]: unknown}}
     */
    extractRequestAsObject = (event) => {
        event.preventDefault();
        const formData = new FormData( event.target.closest('form') );
        const formEntries = Object.fromEntries(formData );
        return  this.copyObjectRemovingEmptyStrings(formEntries);
    }

    /** Clears all form values.
     *
      */
    clearFormValues = (event) => {
        event.target.closest('form').reset();
    }

    /**
     * Given a request template and a row of request parameters, return a single row of request parameters.
     * @param SingleRowOfRequestParameters - A single row of request parameters.
     * @returns {Object} - A single row of request parameters.
     */
    singleRowToRequest( SingleRowOfRequestParameters ) {
        let finalRequestAsObject;
        finalRequestAsObject = this.requestTemplate == null ? SingleRowOfRequestParameters :
            JSON.parse(this.requestTemplate.replace("${rowWithQuery}", JSON.stringify(SingleRowOfRequestParameters)));
        return finalRequestAsObject;
    }

    async postData(finalRequestAsObject, finalUrl) {
        console.log( "Final Url: '" + finalUrl + "'" );
        try {
            const response = await axios.post(finalUrl, finalRequestAsObject);
            this.afterPostCallback(response);
            return response;
        } catch (error) {
            const messageFromResponse = extractMessageFromResponse(error.response );
            const errorMessage = this.formatErrorMessage(error);
            this.messageFormSetter( messageFromResponse.length > 0 ? messageFromResponse : errorMessage );
            if (this.onErrorCallback) {
                this.onErrorCallback(error);
            }
            console.error('Error thrown during post:', error);
            throw error; // Re-throw so the caller knows it failed
        }
    }
}

export default FormService

