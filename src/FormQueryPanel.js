import axios from "axios";
import {CRUD_ACTION_NONE} from "./enums/crudAction.js";
import {httpErrorToString} from "./HttpUtils.js";

class FormQueryPanel {
    constructor(options) {
        this.queryPanel = options.queryPanel;
        this.setQueryPanel = options.setQueryPanel;
        this.validationRules = options.validationRules;
        this.requestTemplate = options.requestTemplate ?? "${rowWithQuery}";
    }

    setCrudActionInObject( crudAction ) {
        this.setQueryPanel({...this.queryPanel, 'crudAction': crudAction});
        return this.queryPanel;
    }

    showFieldsOfObject( ) {
        this.validationRules.map((validationRule) => {
            const valueToValidate = this.queryPanel[validationRule.field] ?? "no value";
            console.log( "Rule: " + validationRule.field + " is  " + valueToValidate );
        })
    }

    handleInputChange = ( rule ) => {
        return (event) => {
            let value = event.target.value;
            if (rule.type === 'number') {
                value = value === '' ? undefined : Number(value);
            }
            this.setQueryPanel({...this.queryPanel, [rule.field]: value});
        }
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
        // let messagesFromFormValidation = "";
        // this.messageFormSetter(messagesFromFormValidation);
        //
        // if (messagesFromFormValidation.length > 0) return;
        //
        // const queryParametersFromForm = this.extractRequestAsObject(event);
        //
        // messagesFromFormValidation = validateFieldsOfObject(this.validationRules, queryParametersFromForm)
        // if (messagesFromFormValidation.length > 0) {
        //     this.messageFormSetter(messagesFromFormValidation);
        //     return
        // }


        const parametersPriorToBuildingRequest =  this.setCrudActionInObject( this.queryPanel, event.nativeEvent.submitter.value ?? CRUD_ACTION_NONE );
        const requestWithParametersInTemplate = this.placeParametersInTemplate(parametersPriorToBuildingRequest);

        console.log( "Final Request after Crud action: '" + requestWithParametersInTemplate + "'" );
        await this.postData(requestWithParametersInTemplate, event.nativeEvent.submitter.name );
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
    placeParametersInTemplate( ) {
        let finalRequestAsObject;

            JSON.parse(this.requestTemplate.replace("${rowWithQuery}", JSON.stringify( this.queryPanel )));
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

export default FormQueryPanel;

