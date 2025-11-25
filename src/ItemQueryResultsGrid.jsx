import { DataGrid } from '@mui/x-data-grid';
import { getGridColumns } from './Metadata/ValidationRulesToGridColumn.jsx';

import GridColDefBuilder from "./Metadata/GridColDefBuilder.js";

export function ItemQueryResultsGrid(props ) {

    if ( (props?.data?.data?.length ?? 0 ) === 0 ) return null;

    const GridColDefBuilderService = new GridColDefBuilder( getGridColumns() );

    const selectColumns  = [
        { "rawGridfieldName" : "id", "girdfieldOptions" : { editable: false } },
        { "rawGridfieldName" : "description", "girdfieldOptions" : { } },
        { "rawGridfieldName" : "unitCost", "girdfieldOptions" : {  } },
        { "rawGridfieldName" : "sourcing", "girdfieldOptions" : {  }   },
        { "rawGridfieldName" : "maxDepth", "girdfieldOptions" :  { editable: false } },
        { "rawGridfieldName" : "leadTime", "girdfieldOptions" : { } },
        { "rawGridfieldName" : "quantityOnHand", "girdfieldOptions" : { } } ];


    const columnsToRender = GridColDefBuilderService.buildColumnDefs( selectColumns )

    return <DataGrid columns={columnsToRender} rows={props.data.data} density="compact" />;
}