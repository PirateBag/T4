export const non200ErrorMessage = (response) => {
    if (response === undefined || response.status == 200) return "";

    const errors = response?.data?.errors || [];
    return errors.map(error => error.message + "\n").join("");
};