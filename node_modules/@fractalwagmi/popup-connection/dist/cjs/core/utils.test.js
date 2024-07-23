"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
let windowOpenSpy;
const FAKE_WINDOW = {};
beforeEach(() => {
    windowOpenSpy = jest.spyOn(window, 'open');
    windowOpenSpy.mockImplementation(() => FAKE_WINDOW);
});
describe('openPopup', () => {
    it('should open the correct URL', () => {
        (0, utils_1.openPopup)({ url: 'https://google.com' });
        expect(windowOpenSpy).toHaveBeenCalledWith('https://google.com', expect.any(String), expect.any(String));
    });
});
//# sourceMappingURL=utils.test.js.map