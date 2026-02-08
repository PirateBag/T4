import axios from "axios";

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
        this.messageFromFormSetter = options.messageFromFormSetter;
        this.afterPostCallback = options.afterPostCallback ?? (() => {});
        this.onErrorCallback = options.onErrorCallback ?? (() => {});
        this.requestTemplate = options.requestTemplate;
    }

    handleBlurOnTextField( event, validationRule ) {
        const valueToValidate = event.target.value.trim();
        if (validationRule.required && valueToValidate === '') {
            this.messageFromFormSetter("${validationRule.field} is a required field." );
            return;
        }
        const message = validationRule.validate(valueToValidate);
        this.messageFromFormSetter( message );
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
        this.messageFromFormSetter(messagesFromFormValidation);

        if (messagesFromFormValidation.length > 0) return;
        const finalRequestAsObject = this.extractRequestAsObject( event );
        console.log( "Final request:", finalRequestAsObject );
        console.log( "submitter value:", event.nativeEvent.submitter.value );
        const overrideForCrudAction = event.nativeEvent.submitter.value ?? "";
        if ( overrideForCrudAction !== "" && finalRequestAsObject?.updatedRows[ 0 ]?.crudAction !== undefined ) {
            finalRequestAsObject.updatedRows[ 0 ].crudAction = overrideForCrudAction;
            console.log( "CrudAction updated top  '" + finalRequestAsObject.updatedRows[ 0 ].crudAction + "'" );
        }
        console.log( "effective reqiest Pbkect : '" + finalRequestAsObject + "'" );
        await this.postData(finalRequestAsObject, event.nativeEvent.submitter.name );
    }

    extractRequestAsObject = (event) => {
        event.preventDefault();
        const formEntries = Object.fromEntries(new FormData(event.target.closest('form')).entries());
        const formEntriesPurgedOfEmptyStrings = this.copyObjectRemovingEmptyStrings(formEntries);
        return  this.singleRowToRequest( this.requestObject ?? formEntriesPurgedOfEmptyStrings);
    }

    /** Clears all form values.
     *
      */
    clearFormValues = (event) => {
        event.target.closest('form').reset();
    }

    singleRowToRequest( SingleRowOfRequestParameters ) {
        let finalRequestAsObject;
        finalRequestAsObject = this.requestTemplate == null ? SingleRowOfRequestParameters :
            JSON.parse(this.requestTemplate.replace("${rowWithQuery}", JSON.stringify(SingleRowOfRequestParameters)));
        return finalRequestAsObject;
    }

    async postData(finalRequestAsObject, finalUrl) {
        //  this.messageFromFormSetter("");
        try {
            const response = await axios.post(finalUrl, finalRequestAsObject);
            this.afterPostCallback(response);
            return response;
        } catch (error) {
            const errorMessage = this.formatErrorMessage(error);
            this.messageFromFormSetter(errorMessage);

            if (this.onErrorCallback) {
                this.onErrorCallback(error);
            }
            console.error('Error creating post:', error);
            throw error; // Re-throw so the caller knows it failed
        }
    }
}

export default FormService

