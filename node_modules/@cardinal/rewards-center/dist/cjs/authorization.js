"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remainingAccountsForAuthorization = void 0;
const pda_1 = require("./pda");
const remainingAccountsForAuthorization = (stakePool, mintId, mintMetadata) => {
    var _a, _b, _c, _d;
    if (stakePool.parsed.requiresAuthorization &&
        !((_a = mintMetadata === null || mintMetadata === void 0 ? void 0 : mintMetadata.data.creators) === null || _a === void 0 ? void 0 : _a.some((c) => stakePool.parsed.allowedCreators
            .map((c) => c.toString())
            .includes(c.address.toString()))) &&
        !(((_b = mintMetadata === null || mintMetadata === void 0 ? void 0 : mintMetadata.collection) === null || _b === void 0 ? void 0 : _b.key) &&
            stakePool.parsed.allowedCollections
                .map((c) => c.toString())
                .includes((_d = (_c = mintMetadata === null || mintMetadata === void 0 ? void 0 : mintMetadata.collection) === null || _c === void 0 ? void 0 : _c.key) === null || _d === void 0 ? void 0 : _d.toString()))) {
        return [
            {
                pubkey: (0, pda_1.findStakeAuthorizationRecordId)(stakePool.pubkey, mintId),
                isSigner: false,
                isWritable: false,
            },
        ];
    }
    return [];
};
exports.remainingAccountsForAuthorization = remainingAccountsForAuthorization;
//# sourceMappingURL=authorization.js.map