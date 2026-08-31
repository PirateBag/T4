/** Compare two objects for shallow equality. */

export const isShallowEqual = (obj1, obj2) => {
    if ( obj1 === undefined || obj2 === undefined) return false;
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) return false;
    return keys1.every(key => obj1[key] === obj2[key]);
};