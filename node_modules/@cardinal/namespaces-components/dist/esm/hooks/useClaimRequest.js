import { __awaiter } from "tslib";
import { getClaimRequest } from "@cardinal/namespaces";
import { useMemo, useState } from "react";
export const useClaimRequest = (connection, namespaceName, entryName, pubkey) => {
    const [loadingClaimRequest, setLoadingClaimRequest] = useState(undefined);
    const [claimRequest, setClaimRequest] = useState(undefined);
    const getClaimRequestData = () => __awaiter(void 0, void 0, void 0, function* () {
        setLoadingClaimRequest(true);
        try {
            if (!pubkey || !entryName || !connection)
                return;
            const data = yield getClaimRequest(connection, namespaceName, entryName, pubkey);
            setClaimRequest(data);
        }
        catch (e) {
            setClaimRequest(undefined);
            console.log(`Failed to get claim request: ${e}`, e);
        }
        finally {
            setLoadingClaimRequest(false);
        }
    });
    useMemo(() => __awaiter(void 0, void 0, void 0, function* () {
        getClaimRequestData();
    }), [connection, namespaceName, entryName, pubkey]);
    return {
        claimRequest,
        loadingClaimRequest,
        getClaimRequestData,
    };
};
//# sourceMappingURL=useClaimRequest.js.map