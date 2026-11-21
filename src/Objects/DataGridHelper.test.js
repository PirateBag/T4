import { describe, it, expect, vi } from 'vitest';
import { handleRowSelectionChangeDefault } from './DataGridHelper.jsx';

describe('handleRowSelectionChangeDefault', () => {
    it('returns a function that sets the first selected row on call', () => {
        const rowsSetter = vi.fn();
        const handler = handleRowSelectionChangeDefault({ rowsSetter });

        expect(typeof handler).toBe('function');
        expect(rowsSetter).not.toHaveBeenCalled();

        handler([{ id: 1, name: 'Item 1' }]);
        expect(rowsSetter).toHaveBeenCalledWith({ id: 1, name: 'Item 1' });
    });

    it('handles empty selection array gracefully', () => {
        const rowsSetter = vi.fn();
        const handler = handleRowSelectionChangeDefault({ rowsSetter });

        handler([]);
        expect(rowsSetter).toHaveBeenCalledWith(null);
    });

    it('supports direct function passing as options', () => {
        const rowsSetter = vi.fn();
        const handler = handleRowSelectionChangeDefault(rowsSetter);

        handler([{ id: 2, name: 'Item 2' }]);
        expect(rowsSetter).toHaveBeenCalledWith({ id: 2, name: 'Item 2' });
    });

    it('handles options object with both rowsGetter and rowsSetter', () => {
        const rowsSetter = vi.fn();
        const selectedRow = { id: 10, description: 'Component A' };
        const handler = handleRowSelectionChangeDefault({ rowsGetter: selectedRow, rowsSetter });

        handler([{ id: 20, description: 'Component B' }]);
        expect(rowsSetter).toHaveBeenCalledWith({ id: 20, description: 'Component B' });
    });

    it('selects the first row when multiple rows are provided in array', () => {
        const rowsSetter = vi.fn();
        const handler = handleRowSelectionChangeDefault({ rowsSetter });

        handler([{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }]);
        expect(rowsSetter).toHaveBeenCalledWith({ id: 1, name: 'Item 1' });
    });

    it('handles a single row object passed directly instead of an array', () => {
        const rowsSetter = vi.fn();
        const handler = handleRowSelectionChangeDefault({ rowsSetter });

        handler({ id: 3, name: 'Item 3' });
        expect(rowsSetter).toHaveBeenCalledWith({ id: 3, name: 'Item 3' });
    });

    it('handles null or undefined selection gracefully', () => {
        const rowsSetter = vi.fn();
        const handler = handleRowSelectionChangeDefault({ rowsSetter });

        handler(null);
        expect(rowsSetter).toHaveBeenCalledWith(null);

        handler(undefined);
        expect(rowsSetter).toHaveBeenCalledWith(null);
    });

    it('does not throw when options or rowsSetter is invalid or omitted', () => {
        const handler1 = handleRowSelectionChangeDefault(undefined);
        expect(typeof handler1).toBe('function');
        expect(() => handler1([{ id: 1 }])).not.toThrow();

        const handler2 = handleRowSelectionChangeDefault({});
        expect(typeof handler2).toBe('function');
        expect(() => handler2([{ id: 1 }])).not.toThrow();
    });
});
