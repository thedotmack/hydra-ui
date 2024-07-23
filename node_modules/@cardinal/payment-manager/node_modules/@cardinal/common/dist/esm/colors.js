import { darken, getLuminance, lighten } from "polished";
export const hexColor = (colorString) => {
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
export const contrastify = (amount, color) => getLuminance(color) > 0.5 ? darken(amount, color) : lighten(amount, color);
//# sourceMappingURL=colors.js.map