"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withCluster = exports.chunkArray = exports.capitalizeFirstLetter = exports.camelCase = exports.firstParam = exports.getQueryParam = void 0;
const getQueryParam = (url, name) => {
    if (!url || !name)
        return null;
    const q = url.match(new RegExp("[?&]" + name + "=([^&#]*)"));
    return q && q[1];
};
exports.getQueryParam = getQueryParam;
const firstParam = (param) => {
    if (!param)
        return "";
    return typeof param === "string" ? param : param[0] || "";
};
exports.firstParam = firstParam;
const camelCase = (str) => {
    return str
        .split(" ")
        .map((x) => x.charAt(0).toUpperCase() + x.slice(1))
        .join("");
};
exports.camelCase = camelCase;
const capitalizeFirstLetter = (value) => {
    return value[0] ? value[0].toUpperCase() + value.slice(1) : "";
};
exports.capitalizeFirstLetter = capitalizeFirstLetter;
const chunkArray = (arr, size) => arr.length > size
    ? [arr.slice(0, size), ...(0, exports.chunkArray)(arr.slice(size), size)]
    : [arr];
exports.chunkArray = chunkArray;
const withCluster = (s, cluster) => {
    return `${s}${cluster !== "mainnet-beta" && cluster !== "mainnet"
        ? `${s.includes("?") ? "&" : "?"}cluster=${cluster}`
        : ""}`;
};
exports.withCluster = withCluster;
//# sourceMappingURL=utils.js.map