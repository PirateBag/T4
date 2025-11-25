
class GridColDefBuilder {
    constructor( rawGridColumns) {
        // Set defaults
        this.rawGridColumns = rawGridColumns
    }

    buildGridColDef( domainName, girdfieldOption ){
        const rawGridColumn  = this.rawGridColumns.find( col =>col.field === domainName );
        if ( rawGridColumn === undefined ) {
            console.log("Cannot find column " + domainName);
            return [];
        }
        const updatedGridColumn = { ...rawGridColumn, ...girdfieldOption }
        return updatedGridColumn;
    }

    buildColumnDefs( presentationFields ){

        const updatedGridColumns = [];

        for( const presentationField of presentationFields ){
            const updatedGridColumn = this.buildGridColDef( presentationField.rawGridfieldName,
                presentationField.girdfieldOptions );
            updatedGridColumns.push( updatedGridColumn );
        }
        return updatedGridColumns;
    }
}

export function createDefaultObjectFromGridColumns(gridColumns ) {
    const defaultObject = { 'id' : 0 };
    for( const gridColumn of gridColumns ) {
        if ( gridColumn.field === 'id' ) continue;
        defaultObject[ gridColumn.field ] = gridColumn.defaultValue;
    }
    return [ defaultObject ];
}

export default GridColDefBuilder