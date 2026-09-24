export const bomResponse = (bomResponse)  => {
    if ( bomResponse === undefined ) return "";

    return bomResponse.id + " " + bomResponse.childDescription + ", " +
        bomResponse.quantityPer + " per parent";
};

export const itemIdDescription = (item) => {
    if ( item === undefined ) return "";

    return item.id + ", " + item.description;
}

export const objectToStringCredential = (credential) => {
    if ( credential === undefined ) return "";

    return credential.userName + ", " + credential.token;
}