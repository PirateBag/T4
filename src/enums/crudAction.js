
export const CRUD_ACTION_NONE = "NONE";
export const CRUD_ACTION_CHANGE = "CHANGE";
export const CRUD_ACTION_DELETE = "DELETE";
export const CRUD_ACTION_INSERT = "INSERT";
export const CRUD_ACTION_DELETE_SILENT = "DELETE_SILENT";

export function mapSubstringToCrudAction( subString ) {
    const subStringInUppercase = subString.toLocaleUpperCase();
    if ( subStringInUppercase?.startsWith('DEL') ) {
        return CRUD_ACTION_DELETE;
    }
    if ( subStringInUppercase?.startsWith('INS') ) {
        return CRUD_ACTION_INSERT;
    }
    if ( subStringInUppercase?.startsWith('CHA') ) {
        return CRUD_ACTION_CHANGE;
    }
    return CRUD_ACTION_NONE;
}