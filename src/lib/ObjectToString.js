export const bomResponse = (bomResponse)  => {
    if ( bomResponse === undefined ) return "";

    return bomResponse.id + " " + bomResponse.childDescription + ", " +
        bomResponse.quantityPer + " per parent";
};