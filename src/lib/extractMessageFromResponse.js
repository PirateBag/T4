export const non200ErrorMessage = (response) => {
    if (response === undefined || response.status == 200) return "";

    const errors = response?.data?.errors || [];
    return errors.map(error => error.message + "\n").join("");
};


export function extractMessageFromResponse(response) {
    let rValue = "";
    const errors = response?.data?.errors ?? [];
    errors.map((error) => rValue += error.message + "\n");
    return rValue;
}