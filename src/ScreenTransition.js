
export class ScreenTransition {
    // default values can be set here
    nextScreen = null;
    activityState = '';
    data = [];


    // constructor to initialize properties
    constructor(nextScreen, activityState, data) {
        if ( nextScreen === null || activityState ===null || data === null )
            { throw new Error( "null pointer in constructor parameters" ); }
        this.nextScreen = nextScreen;
        this.activityState = activityState;
        this.data = data;
    }
}

