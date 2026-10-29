import axios from "axios";

export function httpErrorToString(error) {
        // Handle common HTTP status codes
        switch ( error.status ) {
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
                return `Error: ${error.status}. Please try again.`;
        }
    }

export async function postData( { parameters, url } ) {
    console.log( "HttpUtil.postData Request : '" + url + "'" + JSON.stringify(parameters)   );
    let response = {};
    try {
        response = await axios.post(url, parameters);
        console.log( "HttpUtil.postData Response: '" + JSON.stringify(response.data) + "'" );
        return response;
    } catch (error) {
        console.error('Error thrown during post:', error);
        if (error.response?.status === 500) {
            throw error;
        }
        return error.response;
    }
}


