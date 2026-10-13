import { describe, it, expect, vi } from 'vitest';
import * as HttpUtils from '../HttpUtils.js';
import { loadItemPickListAll, loadItemPickList } from './ItemPickListService.js';

describe('ItemPickListService', () => {
    it('successfully loads items with loadItemPickListAll and invokes responseSetter', async () => {
        const mockData = [
            { id: 1, external: 'Item 1' },
            { id: 2, external: 'Item 2' }
        ];

        vi.spyOn(HttpUtils, 'postData').mockResolvedValue({
            status: 200,
            data: { data: mockData }
        });

        const responseSetter = vi.fn();
        const errorMessageSetter = vi.fn();

        const result = await loadItemPickListAll({ responseSetter, errorMessageSetter });

        expect(result).toEqual(mockData);
        expect(responseSetter).toHaveBeenCalledWith(mockData);
        expect(errorMessageSetter).not.toHaveBeenCalled();
    });

    it('handles non-200 responses and invokes errorMessageSetter', async () => {
        vi.spyOn(HttpUtils, 'postData').mockResolvedValue({
            status: 500,
            data: {}
        });

        const responseSetter = vi.fn();
        const errorMessageSetter = vi.fn();

        const result = await loadItemPickList({ responseSetter, errorMessageSetter });

        expect(responseSetter).not.toHaveBeenCalled();
        expect(errorMessageSetter).toHaveBeenCalledWith(expect.stringContaining('500'));
    });
});
