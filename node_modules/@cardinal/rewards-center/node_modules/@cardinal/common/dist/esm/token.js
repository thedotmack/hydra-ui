import { __awaiter } from "tslib";
import { getAssociatedTokenAddress } from "@solana/spl-token";
/**
 * Utility function to get associated token address
 * @param mint
 * @param owner
 * @param allowOwnerOffCurve
 * @returns
 */
export function findAta(mint, owner, allowOwnerOffCurve) {
    return __awaiter(this, void 0, void 0, function* () {
        return getAssociatedTokenAddress(mint, owner, allowOwnerOffCurve);
    });
}
//# sourceMappingURL=token.js.map