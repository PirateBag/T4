export class Stack {
    constructor() {
        this.items = [];
    }

    // Method to add an item to the stack
    push(item) {
        this.items.push(item);
    }

    // Method to remove an item from the stack
    /*
    pop() {
        if (this.items.length === 0) {
            return "Underflow - Stack is empty";
        }
        return this.items.pop();
    }

    // Method to view the top item in the stack
    peek() {
        if (this.items.length === 0) {
            return "Stack is empty";
        }
        return this.items[this.items.length - 1];
    }


     */
    stackTop() {
        if ( this.items.length > 0 )
            return this.items[0].nextScreen;
        return null;
    }

    pushToNextScreen( screenTransition ) {
        this.push( screenTransition );
    }
}

export let ScreenStack = new Stack();