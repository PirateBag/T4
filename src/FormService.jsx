import {validateAllFieldsOnForm} from "./Metadata/ValidateRule.js";
import axios from "axios";
import itemQuery from "./Forms/ItemQuery.jsx";
import {ScreenTransition} from "./ScreenTransition.js";
import {ScreenStack} from "./Stack.js";

export class FormService {
    constructor(options) {
        this.messagesFromForm = options.messagesFromForm;
        this.messageFromFormSetter = options.messageFromFormSetter;
        this.url = options.url;
        this.afterPostCallback = options.afterPostCallback ?? (() => {});
        this.isValidateForm = options.isValidateForm ?? true;
        this.onErrorCallback = options.onErrorCallback ?? (() => {});
        this.requestTemplate = options.requestTemplate;
    }

    formatErrorMessage(error) {
        // Network error
        if (error.code === 'ERR_NETWORK' || !error.response) {
            return "Network error. Please check your connection and try again.";
        }

        // HTTP error with response
        if (error.response) {
            const status = error.response.status;
            const data = error.response.data;

            // Check if server sent a message
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

    handleSubmit = async (event) => {
        event.preventDefault();

        let messagesFromFormValidation = this.isValidateForm ? validateAllFieldsOnForm(event) : "";
        this.messageFromFormSetter(messagesFromFormValidation);

        if (messagesFromFormValidation.length > 0) return;

        const formData = new FormData(event.target);
        const requestParameters = Object.fromEntries(formData.entries());

        const finalRequestAsObject = this.requestTemplate == null ? requestParameters :
            JSON.parse( this.requestTemplate.replace("${rowWithQuery}", JSON.stringify(requestParameters)));

        axios.post( this.url, finalRequestAsObject )
            .then(response => {
                let nextScreen = new ScreenTransition(itemQuery, 'NONE', response.data);
                ScreenStack.pushToNextScreen(nextScreen);
                this.afterPostCallback( response );
            })
            .catch(error => {
                // Enhanced error handling
                const errorMessage = this.formatErrorMessage(error);
                this.messageFromFormSetter(errorMessage);

                // Call custom error callback if provided
                if (this.onErrorCallback) {
                    this.onErrorCallback(error);
                }

                console.error('Error submitting form:', error);


                console.error('Error creating post:', error);
            });
    }
}