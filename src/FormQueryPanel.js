import {CRUD_ACTION_NONE} from "./enums/crudAction.js";
import {placeParametersInTemplate, postData, removeBlanksFromShallowObject} from "./HttpUtils.js";
import {modernRequestPayloadTemplate} from "./Globals.js";

export function extractMessageFromResponse(response) {
    let rValue = "";
    const errors = response?.data?.errors ?? [];
    errors.map((error) => rValue += error.message + "\n");
    return rValue;
}

class FormQueryPanel {
    constructor(options) {
        this.queryPanel = options.queryPanel;
        this.setQueryPanel = options.setQueryPanel;
        this.validationRules = options.validationRules;
        this.requestTemplate = options.requestTemplate ?? "${rowWithQuery}";
        this.afterPostCallback = options.afterPostCallback;
    }

    setCrudActionInObject(crudAction) {
        this.setQueryPanel({...this.queryPanel, 'crudAction': crudAction});
        return this.queryPanel;
    }

    handleInputChange = (rule) => {
        return (event) => {
            let value = rule.type === 'checkbox' ? event.target.checked : event.target.value;
            if (rule.type === 'number') {
                value = value === '' ? undefined : Number(value);
            }
            this.setQueryPanel({...this.queryPanel, [rule.field]: value});
        }
    }

    handleBlurOnTextField(event, validationRule) {
        const valueToValidate = event.target.value.trim();
        if (validationRule.required && valueToValidate === '') {
            this.messageFormSetter("${validationRule.field} is a required field.");
            return;
        }
        const message = validationRule.validate(valueToValidate);
        this.messageFormSetter(message);
    }



    handleSubmit = async (event) => {
        event.preventDefault();

        const parametersPriorToBuildingRequest = this.setCrudActionInObject(CRUD_ACTION_NONE);
        const parametersAfterRemovingFieldsWithEmptyValues = removeBlanksFromShallowObject(parametersPriorToBuildingRequest, this.validationRules);
        const requestWithParametersInTemplate = placeParametersInTemplate( {
            'requestTemplate' : modernRequestPayloadTemplate,
            'singleRowOfQueryParameters' : parametersAfterRemovingFieldsWithEmptyValues } );

        const [response] = await Promise.all([postData( {'parameters' : requestWithParametersInTemplate,
            'url' : event.nativeEvent.submitter.name })]);
        this.afterPostCallback(response);
    }


    /** Clears all form values.
     *
     */
    clearFormValues = (event) => {
        event.target.closest('form').reset();
    }
}


export default FormQueryPanel;

