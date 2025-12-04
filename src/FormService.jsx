import axios from "axios";

export class FormService {
    constructor(options) {
        this.messagesFromForm = options.messagesFromForm;
        this.messageFromFormSetter = options.messageFromFormSetter;
        this.url = options.url;
        this.afterPostCallback = options.afterPostCallback ?? (() => {});
        this.isValidateForm = options.isValidateForm ?? true;
        this.onErrorCallback = options.onErrorCallback ?? (() => {});
        this.requestTemplate = options.requestTemplate;
        this.requestObject = options.requestObject;
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

    handleSubmit = async (event) => {
        event.preventDefault();

        let messagesFromFormValidation = "";
        this.messageFromFormSetter(messagesFromFormValidation);


        if (messagesFromFormValidation.length > 0) return;
        let formEntries = Object.fromEntries(new FormData(event.target).entries());
        console.log( "formEntries " + formEntries);
        const formData = new FormData(event.target);
        const finalRequestAsObject = this.singleRowToRequest( this.requestObject ?? Object.fromEntries(formData.entries()));
        this.postData(finalRequestAsObject);
    }

    singleRowToRequest( SingleRowOfRequestParameters ) {
        let finalRequestAsObject;
        finalRequestAsObject = this.requestTemplate == null ? SingleRowOfRequestParameters :
            JSON.parse(this.requestTemplate.replace("${rowWithQuery}", JSON.stringify(SingleRowOfRequestParameters)));
        return finalRequestAsObject;
    }

    postData = (finalRequestAsObject) => {
        axios.post( this.url, finalRequestAsObject )
            .then(response => {
                this.afterPostCallback( response );
            })
            .catch(error => {
                // Enhanced error handling
                const errorMessage = this.formatErrorMessage(error);
                this.messageFromFormSetter(errorMessage);

                // Call the custom error callback if provided
                if (this.onErrorCallback) {
                    this.onErrorCallback(error);
                }
                console.error('Error creating post:', error);
            });
    }
}