import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('./Forms/Login2.jsx', () => ({
    default: () => null,
}));

import { Stack } from './Stack.js';
import { ScreenTransition } from './ScreenTransition.js';
import { CRUD_ACTION_NONE } from './enums/crudAction.js';

describe('Stack and Browser History Synchronization', () => {
    let pushStateSpy;
    let backSpy;

    beforeEach(() => {
        pushStateSpy = vi.fn();
        backSpy = vi.fn();

        globalThis.window = {
            history: {
                pushState: pushStateSpy,
                replaceState: vi.fn(),
                back: backSpy,
            },
        };
    });

    afterEach(() => {
        delete globalThis.window;
        vi.restoreAllMocks();
    });

    it('initializes with default screen and length 1', () => {
        const stack = new Stack();
        expect(stack.length()).toBe(1);
        expect(stack.stackTop().label).toBe('Login');
        expect(stack.isHandlingPopState).toBe(false);
    });

    it('pushes new screen and calls window.history.pushState', () => {
        const stack = new Stack();
        const callbackSpy = vi.fn();
        stack.setOnStackChange(callbackSpy);

        const DummyComponent = () => null;
        const transition = new ScreenTransition('Inventory Planning', DummyComponent, CRUD_ACTION_NONE, []);

        stack.push(transition);

        expect(stack.length()).toBe(2);
        expect(stack.stackTop().label).toBe('Inventory Planning');
        expect(pushStateSpy).toHaveBeenCalledWith({ stackIndex: 1 }, 'Inventory Planning');
        expect(callbackSpy).toHaveBeenCalledWith(2);
    });

    it('popInternal pops item without calling window.history.back', () => {
        const stack = new Stack();
        const callbackSpy = vi.fn();
        stack.setOnStackChange(callbackSpy);

        const DummyComponent = () => null;
        const transition = new ScreenTransition('Screen 2', DummyComponent, CRUD_ACTION_NONE, []);
        stack.push(transition);

        expect(stack.length()).toBe(2);

        stack.popInternal();

        expect(stack.length()).toBe(1);
        expect(stack.stackTop().label).toBe('Login');
        expect(backSpy).not.toHaveBeenCalled();
        expect(callbackSpy).toHaveBeenLastCalledWith(1);
    });

    it('popInternal guards against popping the root screen (length === 1)', () => {
        const stack = new Stack();
        const callbackSpy = vi.fn();
        stack.setOnStackChange(callbackSpy);

        expect(stack.length()).toBe(1);

        stack.popInternal();

        expect(stack.length()).toBe(1);
        expect(stack.stackTop().label).toBe('Login');
        expect(callbackSpy).not.toHaveBeenCalled();
    });

    it('pop calls window.history.back when length > 1 and history is available', () => {
        const stack = new Stack();
        const DummyComponent = () => null;
        const transition = new ScreenTransition('Screen 2', DummyComponent, CRUD_ACTION_NONE, []);
        stack.push(transition);

        expect(stack.length()).toBe(2);

        stack.pop();

        expect(backSpy).toHaveBeenCalledTimes(1);
    });

    it('pop guards against popping the root screen (length === 1)', () => {
        const stack = new Stack();

        expect(stack.length()).toBe(1);

        stack.pop();

        expect(backSpy).not.toHaveBeenCalled();
        expect(stack.length()).toBe(1);
    });

    it('pop falls back to popInternal if window.history.back is unavailable', () => {
        globalThis.window.history = null;

        const stack = new Stack();
        const callbackSpy = vi.fn();
        stack.setOnStackChange(callbackSpy);

        const DummyComponent = () => null;
        const transition = new ScreenTransition('Screen 2', DummyComponent, CRUD_ACTION_NONE, []);
        stack.items.push(transition);

        expect(stack.length()).toBe(2);

        stack.pop();

        expect(stack.length()).toBe(1);
        expect(callbackSpy).toHaveBeenCalledWith(1);
    });

    it('simulates popstate navigation workflow', () => {
        const stack = new Stack();
        const callbackSpy = vi.fn();
        stack.setOnStackChange(callbackSpy);

        const DummyComponent = () => null;
        const transition1 = new ScreenTransition('Screen 1', DummyComponent, CRUD_ACTION_NONE, []);
        const transition2 = new ScreenTransition('Screen 2', DummyComponent, CRUD_ACTION_NONE, []);

        stack.push(transition1);
        stack.push(transition2);
        expect(stack.length()).toBe(3);

        // Simulate popstate handler triggering popInternal
        if (stack.length() > 1) {
            stack.popInternal();
        }

        expect(stack.length()).toBe(2);
        expect(stack.stackTop().label).toBe('Screen 1');

        if (stack.length() > 1) {
            stack.popInternal();
        }

        expect(stack.length()).toBe(1);
        expect(stack.stackTop().label).toBe('Login');

        // Boundary: popstate at root
        if (stack.length() > 1) {
            stack.popInternal();
        }

        expect(stack.length()).toBe(1);
    });
});
