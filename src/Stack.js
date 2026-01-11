import {ScreenTransition} from "./ScreenTransition.js";
import Login from "./Forms/Login.jsx";
import {CRUD_ACTION_NONE} from "./crudAction.js";

export class Stack {
    constructor() {
        this.items = [ new ScreenTransition( "Login", Login, CRUD_ACTION_NONE, [] ) ];
        this.onStackChangeCallback = null;
    }

    // Set callback to be invoked when the stack changes
    setOnStackChange(callback) {
        this.onStackChangeCallback = callback;
    }

    // Method to add an item to the stack
    push(item) {
        this.items.push(item);
        this.onStackChangeCallback(this.items.length );
    }

    pop() {
        this.items.pop();
        this.onStackChangeCallback(this.items.length );
    }

    stackTop() {
        return this.items[this.items.length - 1];
    }

    length() { return this?.items?.length ?? 0;}
}
export let ScreenStack = new Stack();