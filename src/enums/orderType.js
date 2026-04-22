import {SOURCING_MAN, SOURCING_PUR} from "./sourcing.js";

export const ORDER_TYPE_PO  = "PO";
export const ORDER_TYPE_MODET = "MODET";
export const ORDER_TYPE_MOHEAD  = "MOHEAD";
export const ORDER_TYPE_NA  = "NA";

export const sourceAndOrderTypeMap = {
    [SOURCING_PUR] : ORDER_TYPE_PO,
    [SOURCING_MAN] : ORDER_TYPE_MOHEAD
}
