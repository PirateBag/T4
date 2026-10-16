import {ScreenTransition} from "./ScreenTransition.js";
import {CRUD_ACTION_NONE} from "./enums/crudAction.js";
import Login2 from "./Forms/Login2.jsx";

export class Stack {
    constructor() {
        this.items = [ new ScreenTransition( "Login", Login2, CRUD_ACTION_NONE, [] ) ];
        this.onStackChangeCallback = null;
        this.isHandlingPopState = false;
    }

    // Set callback to be invoked when the stack changes
    setOnStackChange(callback) {
        this.onStackChangeCallback = callback;
    }

    pushStateToHistory(item) {
        if (typeof window !== 'undefined' && window.history && typeof window.history.pushState === 'function') {
            window.history.pushState({ stackIndex: this.items.length - 1 }, item.label);
        }
    }

    // Method to add an item to the stack
    push(item) {
        this.items.push(item);
        this.pushStateToHistory(item);
        if (this.onStackChangeCallback) {
            this.onStackChangeCallback(this.items.length);
        }
    }

    popInternal() {
        if (this.items.length <= 1) {
            return;
        }
        this.items.pop();
        if (this.onStackChangeCallback) {
            this.onStackChangeCallback(this.items.length);
        }
    }

    pop() {
        if (this.items.length <= 1) {
            return;
        }
        if (typeof window !== 'undefined' && window.history && typeof window.history.back === 'function') {
            window.history.back();
        } else {
            this.popInternal();
        }
    }

    stackTop() {
        return this.items[this.items.length - 1];
    }

    length() { return this?.items?.length ?? 0;}
}
export let ScreenStack = new Stack();