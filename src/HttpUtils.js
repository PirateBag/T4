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

export function removeBlanksFromShallowObject(obj, validationRules) {
    return validationRules.reduce((response, validationRule) => {
        const type = validationRule.type;
        const value = obj[validationRule.field];

        if (value === undefined || value === null) {
            return response;
        }

        if (type === 'string' || type === 'selectSelect') {
            const effectiveValue = value.trimEnd();
            // Note: Ensure .isNotEmpty() is defined on String prototype or use !effectiveValue
            if (effectiveValue && effectiveValue.length > 0) {
                response[validationRule.field] = effectiveValue;
            }
        } else {
            response[validationRule.field] = value;
        }

        return response;
    }, {}); // Initialized as an object {}
}

export async function postData(finalRequestAsObject, finalUrl) {
    console.log( "PostData: '" + finalUrl + "'" + JSON.stringify(finalRequestAsObject)   );
    let response = {};
    try {
        response = await axios.post(finalUrl, finalRequestAsObject);
        console.log( "PostData response: '" + JSON.stringify(response.data.data) + "'" );
        return response;
    } catch (error) {
        response.status =  httpErrorToString(error.response );
        console.error('Error thrown during post:', error);
        return response;
    }
}

//
// export function removeBlanksFromShallowObject(obj,validationRules) {
//     let response = {};
//
//     validationRules.map( (validationRule) =>
//     {
//         const type = validationRule.type;
//         const value = obj[validationRule.field];
//
//         if ( value === undefined || value === null  )
//             return;
//
//         if (type === 'string' || type === 'selectSelect') {
//             const effectiveValue = value.trimEnd();
//             if (effectiveValue.isNotEmpty()) {
//                 response[validationRule.field] = effectiveValue;
//             }
//         } else {
//            response[validationRule.field] = value;
//         }
//     });
//     return response;
// }