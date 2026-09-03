import {CRUD_ACTION_CHANGE, CRUD_ACTION_DELETE, CRUD_ACTION_INSERT} from "./enums/crudAction.js";
import {isShallowEqual} from "./lib/isShallowEqual.js";

export function defaultHandleComponentRowUpdate( newRow, oldRow ) {
    if ( isShallowEqual(newRow, oldRow) )  return oldRow;

    if (newRow.crudAction === oldRow.crudAction || newRow.crudAction === undefined) {
        if (newRow.crudAction !== CRUD_ACTION_DELETE && newRow.crudAction !== CRUD_ACTION_INSERT) {
            newRow.crudAction = CRUD_ACTION_CHANGE;
        }
    }
    return newRow;
}
