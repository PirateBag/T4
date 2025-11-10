import { DataGrid } from '@mui/x-data-grid';
import { getGridColumns } from './Metadata/GridColumns.jsx';

export function ItemQueryResultsGrid( props ) {
    const  allColumns = getGridColumns();
    //  const selectedColumns = allColumns.filter(col => col.field === 'id' || col.field === 'summaryid' || col.field === 'description');
//     const rows = [ { id: 1, summaryId: '12345', description: 'This is a test' } ];
    const selectedColumns = Array.prototype.concat( allColumns.filter(col => col.field === 'id' ),
                            allColumns.filter( col =>col.field === 'summaryId' ),
                            allColumns.filter( col =>col.field === 'description' ),
        allColumns.filter( col =>col.field === 'unitCost' ),
        allColumns.filter( col =>col.field === 'sourcing' ),
        allColumns.filter( col =>col.field === 'maxDepth' ),
        allColumns.filter( col =>col.field === 'leadTime' ),
        allColumns.filter( col =>col.field === 'quantityOnHand' ),
        allColumns.filter( col =>col.field === 'minimumOrderQuantity' )

        );

    return <DataGrid columns={selectedColumns} rows={props.data.data} />;
}