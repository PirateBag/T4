import LoginSummary from "./Objects/LoginSummary.jsx";

export class Stack {
    constructor() {
        this.items = [];
        this.onStackChangeCallback = null;
    }

    // Set callback to be invoked when stack changes
    setOnStackChange(callback) {
        this.onStackChangeCallback = callback;
    }

    // Method to add an item to the stack
    push(item) {
        this.items.push(item);
    }

    stackTop() {
        if ( this.items.length > 0 )
            return this.items[0].nextScreen;
        return null;
    }

    pushToNextScreen( screenTransition, loginSummary = null ) {
        this.push( screenTransition );
        
        // Invoke callback if it's set
        if (this.onStackChangeCallback) {
            const summary = loginSummary || new LoginSummary( "fred", "token", "2025-0-01 12:00:00" );
            this.onStackChangeCallback(this.items.length, summary);
        }
    }
}

export let ScreenStack = new Stack();