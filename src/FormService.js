import axios from "axios";
import {validateFieldsOfObject} from "./Metadata/ValidateRule.js";
import {CRUD_ACTION_NONE} from "./enums/crudAction.js";
import {httpErrorToString} from "./HttpUtils.js";

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
function copyObjectRemovingEmptyStrings(objectToCopy) {
    return Object.fromEntries(
        Object.entries(objectToCopy).filter(([, value]) =>
            value !== null &&
            value !== undefined &&
            value !== ""
        )
    )
}



class FormService {
    constructor(options) {
        this.messagesFromForm = options.messagesFromForm;
        this.messageFormSetter = options.messageFormSetter;
        this.afterPostCallback = options.afterPostCallback ?? (() => {});
        this.onErrorCallback = options.onErrorCallback ?? (() => {});
        this.requestTemplate = options.requestTemplate ?? "${rowWithQuery}";
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
        const overrideForCrudAction = event.nativeEvent.submitter.value ?? "";
        if ( overrideForCrudAction !== "" && finalRequestAsObject.updatedRows ) {
            finalRequestAsObject.updatedRows[ 0 ].crudAction = overrideForCrudAction;
            console.log( "CrudAction updated top  '" + finalRequestAsObject.updatedRows[ 0 ].crudAction + "'" );
        }
        console.log( "Final Request after Crud action: '" + finalRequestAsObject + "'" );
        const response = await this.postData(finalRequestAsObject, event.nativeEvent.submitter.name );

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
        return  copyObjectRemovingEmptyStrings(formEntries);
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
            const messageFromResponse = httpErrorToString(error.response );
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

