import {CaseConversion as screenTransitionParameterFormat} from "./Metadata/ValidationRuleConstants.js";

export class ScreenTransition {
    // default values can be set here
    label = "";
    nextScreen = null;
    activityState = '';
    parameterFormat = screenTransitionParameterFormat.NONE;

    data = [];


    // constructor to initialize properties
    constructor(label, nextScreen, activityState, data, parameterFormat = screenTransitionParameterFormat.NONE ) {
        if ( label === null || nextScreen === null || activityState ===null || data === null )
            { throw new Error( "null pointer in screen transition constructor parameters" ); }
        this.label = label;
        this.nextScreen = nextScreen;
        this.activityState = activityState;
        this.data = data;
        this.parameterFormat = parameterFormat;
    }


}

