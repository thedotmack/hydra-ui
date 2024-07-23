import { __awaiter } from "tslib";
import { getReverseEntry } from "@cardinal/namespaces";
import { useMemo, useState } from "react";
export const useReverseEntry = (connection, pubkey) => {
    const [loading, setLoading] = useState(undefined);
    const [reverseEntryData, setReverseEntry] = useState(undefined);
    const getReverseEntryData = () => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        try {
            if (!pubkey || !connection)
                return;
            const data = yield getReverseEntry(connection, pubkey);
            setReverseEntry(data);
        }
        catch (e) {
            setReverseEntry(undefined);
            console.log(`Failed to get claim request: ${e}`, e);
        }
        finally {
            setLoading(false);
        }
    });
    useMemo(() => __awaiter(void 0, void 0, void 0, function* () {
        getReverseEntryData();
    }), [connection, pubkey]);
    return {
        reverseEntryData,
        getReverseEntryData,
        loading,
    };
};
//# sourceMappingURL=useReverseEntry.js.map