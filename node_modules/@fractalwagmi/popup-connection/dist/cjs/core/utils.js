"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openPopup = exports.validateOrigin = void 0;
const constants_1 = require("./constants");
function validateOrigin(origin) {
    return origin === constants_1.FRACTAL_DOMAIN_HTTPS_WWW || origin === constants_1.FRACTAL_DOMAIN_HTTPS;
}
exports.validateOrigin = validateOrigin;
const TARGET = 'fractal:approval:popup';
const STATIC_POPUP_FEATURES = ['resizable', 'scrollbars=1', 'status=1'];
function openPopup({ left = 0, scope = window, top = 0, width = constants_1.DEFAULT_POPUP_HEIGHT_PX, height = constants_1.DEFAULT_POPUP_HEIGHT_PX, url, }) {
    return scope.open(url, TARGET, getPopupFeatures({ height, left, top, width }));
}
exports.openPopup = openPopup;
function getPopupFeatures({ height, left, top, width, }) {
    return [
        'popup',
        `left=${left}`,
        `top=${top}`,
        `width=${width}`,
        `height=${height}`,
        ...STATIC_POPUP_FEATURES,
    ].join(',');
}
//# sourceMappingURL=utils.js.map