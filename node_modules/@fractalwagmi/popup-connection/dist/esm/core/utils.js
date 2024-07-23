import { FRACTAL_DOMAIN_HTTPS_WWW, FRACTAL_DOMAIN_HTTPS, DEFAULT_POPUP_HEIGHT_PX, } from "./constants.js";
export function validateOrigin(origin) {
    return origin === FRACTAL_DOMAIN_HTTPS_WWW || origin === FRACTAL_DOMAIN_HTTPS;
}
const TARGET = 'fractal:approval:popup';
const STATIC_POPUP_FEATURES = ['resizable', 'scrollbars=1', 'status=1'];
export function openPopup({ left = 0, scope = window, top = 0, width = DEFAULT_POPUP_HEIGHT_PX, height = DEFAULT_POPUP_HEIGHT_PX, url, }) {
    return scope.open(url, TARGET, getPopupFeatures({ height, left, top, width }));
}
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