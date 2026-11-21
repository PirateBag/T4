import {beforeEach, expect, it, vi} from 'vitest';
import React from 'react';
import ItemQuery from './ItemQuery.jsx';
import DataGridHelper from '../Objects/DataGridHelper.jsx';
import ItemProperties from './ItemProperties.jsx';
import {ScreenStack} from '../Stack.js';
import {CRUD_ACTION_CHANGE} from '../enums/crudAction.js';

let state;
let stateIndex;
let effectDependencies;
let pendingEffects;

vi.mock('react', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useState: (initial) => {
            const index = stateIndex++;
            if (!(index in state)) state[index] = initial;
            return [state[index], value => {
                state[index] = typeof value === 'function' ? value(state[index]) : value;
            }];
        },
        useEffect: (effect, dependencies) => {
            if (!effectDependencies || dependencies.some((value, index) => value !== effectDependencies[index])) {
                effectDependencies = dependencies;
                pendingEffects.push(effect);
            }
        },
    };
});

function findElement(element, type) {
    if (!React.isValidElement(element)) return null;
    if (element.type === type) return element;
    for (const child of React.Children.toArray(element.props.children)) {
        const found = findElement(child, type);
        if (found) return found;
    }
    return null;
}

function renderQuery() {
    stateIndex = 0;
    pendingEffects = [];
    const result = ItemQuery();
    pendingEffects.forEach(effect => effect());
    return result;
}

beforeEach(() => {
    state = [];
    effectDependencies = null;
    vi.restoreAllMocks();
});

it('opens properties for the selected row after an edit updates the results', () => {
    const push = vi.spyOn(ScreenStack, 'push').mockImplementation(() => {});
    let grid = findElement(renderQuery(), DataGridHelper);
    const row = {id: 123, description: 'Original'};
    grid.props.setRows([row]);
    grid = findElement(renderQuery(), DataGridHelper);
    grid.props.onSelectionChange([row]);
    grid = findElement(renderQuery(), DataGridHelper);
    const updatedRow = {...row, description: 'Updated'};
    grid.props.setRows([updatedRow]);
    renderQuery();
    grid = findElement(renderQuery(), DataGridHelper);
    const properties = React.Children.toArray(grid.props.extraButtons.props.children)[0];

    expect(properties.props.disabled).toBe(false);
    properties.props.onClick();
    expect(push).toHaveBeenCalledWith(expect.objectContaining({
        nextScreen: ItemProperties,
        activityState: CRUD_ACTION_CHANGE,
        data: [updatedRow],
    }));
});

it('clears the selection when the selected row is removed', () => {
    let grid = findElement(renderQuery(), DataGridHelper);
    const row = {id: 123};
    grid.props.setRows([row]);
    grid = findElement(renderQuery(), DataGridHelper);
    grid.props.onSelectionChange([row]);
    grid = findElement(renderQuery(), DataGridHelper);
    grid.props.setRows([]);
    renderQuery();
    grid = findElement(renderQuery(), DataGridHelper);
    const properties = React.Children.toArray(grid.props.extraButtons.props.children)[0];

    expect(properties.props.disabled).toBe(true);
});