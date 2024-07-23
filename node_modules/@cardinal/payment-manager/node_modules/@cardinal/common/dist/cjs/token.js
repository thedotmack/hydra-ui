"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAta = void 0;
const tslib_1 = require("tslib");
const spl_token_1 = require("@solana/spl-token");
/**
 * Utility function to get associated token address
 * @param mint
 * @param owner
 * @param allowOwnerOffCurve
 * @returns
 */
function findAta(mint, owner, allowOwnerOffCurve) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return (0, spl_token_1.getAssociatedTokenAddress)(mint, owner, allowOwnerOffCurve);
    });
}
exports.findAta = findAta;
//# sourceMappingURL=token.js.map