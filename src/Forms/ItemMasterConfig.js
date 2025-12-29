import {
    ID_VALIDATION, TEXT_VALIDATION
} from "../Metadata/Domain.jsx";

export const textReportConfig  = [
    ID_VALIDATION.appendGridFieldOptions(  { 'editable': false, 'headerName': 'Id'  } ),
    TEXT_VALIDATION.appendGridFieldOptions( {'headerName' : "Crud Action", 'field' : "crudAction",
    'width' : 120 }),
    TEXT_VALIDATION.appendGridFieldOptions( {'headerName' : "Report", 'field' : "message" })
    ];
