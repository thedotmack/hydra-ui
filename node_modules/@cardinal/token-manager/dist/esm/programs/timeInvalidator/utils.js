import { BN } from "@project-serum/anchor";
import { TokenManagerState } from "../tokenManager";
export const shouldTimeInvalidate = (tokenManagerData, timeInvalidatorData, UTCNow = Date.now() / 1000) => {
    const invalidators = tokenManagerData.parsed.invalidators.map((i) => i.toString());
    return (invalidators.includes(timeInvalidatorData.pubkey.toString()) &&
        (tokenManagerData === null || tokenManagerData === void 0 ? void 0 : tokenManagerData.parsed.state) !== TokenManagerState.Invalidated &&
        (tokenManagerData === null || tokenManagerData === void 0 ? void 0 : tokenManagerData.parsed.state) !== TokenManagerState.Initialized &&
        ((timeInvalidatorData.parsed.maxExpiration &&
            new BN(UTCNow).gte(timeInvalidatorData.parsed.maxExpiration)) ||
            (timeInvalidatorData.parsed.expiration &&
                tokenManagerData.parsed.state === TokenManagerState.Claimed &&
                new BN(UTCNow).gte(timeInvalidatorData.parsed.expiration)) ||
            (!timeInvalidatorData.parsed.expiration &&
                tokenManagerData.parsed.state === TokenManagerState.Claimed &&
                !!timeInvalidatorData.parsed.durationSeconds &&
                new BN(UTCNow).gte(tokenManagerData.parsed.stateChangedAt.add(timeInvalidatorData.parsed.durationSeconds)))));
};
//# sourceMappingURL=utils.js.map