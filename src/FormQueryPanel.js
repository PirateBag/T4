import {CRUD_ACTION_NONE} from "./enums/crudAction.js";
import { postData, removeBlanksFromShallowObject} from "./HttpUtils.js";

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
            let value = event.target.value;
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
        const requestWithParametersInTemplate = this.placeParametersInTemplate(parametersAfterRemovingFieldsWithEmptyValues);

        const [response] = await Promise.all([postData(requestWithParametersInTemplate, event.nativeEvent.submitter.name)]);
        this.afterPostCallback(response);
    }


    /** Clears all form values.
     *
     */
    clearFormValues = (event) => {
        event.target.closest('form').reset();
    }

    /**
     * Given a request template and a row of request parameters, return a single row of request parameters.
     * @returns {Object} - A single row of request parameters.
     */
    placeParametersInTemplate() {
        let finalRequestAsObject;
        finalRequestAsObject = JSON.parse(this.requestTemplate.replace("${rowWithQuery}", JSON.stringify(this.queryPanel)));
        return finalRequestAsObject;
    }
}


export default FormQueryPanel;

