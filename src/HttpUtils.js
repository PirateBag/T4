import axios from "axios";

export function httpErrorToString(error) {
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

export async function postData( { requestToSend, destinationUrl } )  {
    console.log( "Final Url: '" + destinationUrl + "'" );
    let response;
    try {
        response = await axios.post(destinationUrl, requestToSend);
    }
    catch (error) {
            const messageFromResponse = httpErrorToString(error.response);
        response.error = messageFromResponse;
            console.error('Error thrown during new postData' + error);
        }
        return response;
    }