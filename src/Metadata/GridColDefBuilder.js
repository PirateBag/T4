
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
        if ( presentationFields.length === 0 ) return updatedGridColumns;

        for( const presentationField of presentationFields ){
            const updatedGridColumn = this.buildGridColDef( presentationField.rawGridfieldName,
                presentationField.girdfieldOptions );
            updatedGridColumns.push( updatedGridColumn );
        }
        return updatedGridColumns;
    }
}

export default GridColDefBuilder