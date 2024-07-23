import { __awaiter } from "tslib";
import { tryGetName } from '@cardinal/namespaces';
import { useMemo, useState } from 'react';
import { useWalletIdentity } from '../providers/WalletIdentityProvider';
export const useAddressName = (connection, address) => {
    const { handle } = useWalletIdentity();
    const [displayName, setDisplayName] = useState();
    const [loadingName, setLoadingName] = useState(true);
    const refreshName = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            setLoadingName(true);
            if (address) {
                const n = yield tryGetName(connection, address);
                setDisplayName(n);
            }
        }
        finally {
            setLoadingName(false);
        }
    });
    useMemo(() => {
        void refreshName();
    }, [connection, address === null || address === void 0 ? void 0 : address.toString(), handle]);
    return { displayName, loadingName };
};
//# sourceMappingURL=useAddressName.js.map