import { __awaiter } from "tslib";
import { breakName } from "@cardinal/namespaces";
import { useMemo, useState } from "react";
import { tryGetImageUrl } from "../utils/format";
import { useAddressName } from "./useAddressName";
export const useAddressImage = (connection, address, dev) => {
    const [addressImage, setAddressImage] = useState(undefined);
    const [loadingImage, setLoadingImage] = useState(true);
    const { displayName, loadingName } = useAddressName(connection, address);
    const refreshImage = (displayName) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            setLoadingImage(true);
            const [_namespace, handle] = displayName ? breakName(displayName) : [];
            if (handle) {
                const imageUrl = yield tryGetImageUrl(handle, dev);
                setAddressImage(imageUrl);
            }
            else {
                setAddressImage(undefined);
            }
        }
        finally {
            setLoadingImage(false);
        }
    });
    useMemo(() => {
        void refreshImage(displayName);
    }, [displayName]);
    return { addressImage, loadingImage: loadingImage || loadingName };
};
//# sourceMappingURL=useAddressImage.js.map