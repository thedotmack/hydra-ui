"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contrastify = exports.hexColor = void 0;
const polished_1 = require("polished");
const hexColor = (colorString) => {
    if (colorString.includes("#"))
        return colorString;
    const [r, g, b] = colorString
        .replace("rgb(", "")
        .replace("rgba(", "")
        .replace(")", "")
        .replace(" ", "")
        .split(",");
    return ("#" +
        [r, g, b]
            .map((x) => {
            const hex = parseInt(x || "").toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        })
            .join(""));
};
exports.hexColor = hexColor;
const contrastify = (amount, color) => (0, polished_1.getLuminance)(color) > 0.5 ? (0, polished_1.darken)(amount, color) : (0, polished_1.lighten)(amount, color);
exports.contrastify = contrastify;
//# sourceMappingURL=colors.js.map