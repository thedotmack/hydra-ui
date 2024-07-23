"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_POPUP_WIDTH_PX = exports.DEFAULT_POPUP_HEIGHT_PX = exports.Connection = exports.Platform = exports.PopupEvent = void 0;
var types_1 = require("./core/types");
Object.defineProperty(exports, "PopupEvent", { enumerable: true, get: function () { return types_1.PopupEvent; } });
Object.defineProperty(exports, "Platform", { enumerable: true, get: function () { return types_1.Platform; } });
var connection_1 = require("./core/connection");
Object.defineProperty(exports, "Connection", { enumerable: true, get: function () { return connection_1.Connection; } });
__exportStar(require("./use-popup-connection"), exports);
__exportStar(require("./connection-manager"), exports);
__exportStar(require("./payloads"), exports);
var constants_1 = require("./core/constants");
Object.defineProperty(exports, "DEFAULT_POPUP_HEIGHT_PX", { enumerable: true, get: function () { return constants_1.DEFAULT_POPUP_HEIGHT_PX; } });
Object.defineProperty(exports, "DEFAULT_POPUP_WIDTH_PX", { enumerable: true, get: function () { return constants_1.DEFAULT_POPUP_WIDTH_PX; } });
//# sourceMappingURL=index.js.map