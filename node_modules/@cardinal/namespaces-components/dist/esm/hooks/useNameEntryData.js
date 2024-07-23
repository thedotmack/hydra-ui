import { __awaiter } from "tslib";
import { certificateIdForMint, getCertificate, } from "@cardinal/certificates";
import { getNameEntry, NAMESPACES_PROGRAM_ID, } from "@cardinal/namespaces";
import * as metaplex from "@metaplex/js";
import * as anchor from "@project-serum/anchor";
import * as splToken from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { useMemo, useState } from "react";
export function getNameEntryData(connection, namespaceName, entryName) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const nameEntry = yield getNameEntry(connection, namespaceName, entryName);
        const { mint } = nameEntry.parsed;
        const [[metaplexId], [certificateId]] = yield Promise.all([
            PublicKey.findProgramAddress([
                anchor.utils.bytes.utf8.encode(metaplex.programs.metadata.MetadataProgram.PREFIX),
                metaplex.programs.metadata.MetadataProgram.PUBKEY.toBuffer(),
                mint.toBuffer(),
            ], metaplex.programs.metadata.MetadataProgram.PUBKEY),
            certificateIdForMint(mint),
        ]);
        const [metaplexData, certificate] = yield Promise.all([
            metaplex.programs.metadata.Metadata.load(connection, metaplexId),
            getCertificate(connection, certificateId),
        ]);
        let json;
        try {
            json =
                metaplexData.data.data.uri &&
                    (yield fetch(metaplexData.data.data.uri).then((r) => r.json()));
        }
        catch (e) {
            console.log("Failed to get json", json);
        }
        const largestHolders = yield connection.getTokenLargestAccounts(mint);
        const certificateMintToken = new splToken.Token(connection, mint, splToken.TOKEN_PROGRAM_ID, 
        // not used
        anchor.web3.Keypair.generate());
        const largestTokenAccount = ((_a = largestHolders === null || largestHolders === void 0 ? void 0 : largestHolders.value[0]) === null || _a === void 0 ? void 0 : _a.address) &&
            (yield certificateMintToken.getAccountInfo((_b = largestHolders === null || largestHolders === void 0 ? void 0 : largestHolders.value[0]) === null || _b === void 0 ? void 0 : _b.address));
        let isOwnerPDA = false;
        if (largestTokenAccount === null || largestTokenAccount === void 0 ? void 0 : largestTokenAccount.owner) {
            const ownerAccountInfo = yield connection.getAccountInfo(largestTokenAccount === null || largestTokenAccount === void 0 ? void 0 : largestTokenAccount.owner);
            isOwnerPDA =
                (ownerAccountInfo === null || ownerAccountInfo === void 0 ? void 0 : ownerAccountInfo.owner.toString()) === NAMESPACES_PROGRAM_ID.toString();
        }
        return {
            nameEntry,
            certificate,
            metaplexData,
            arweaveData: { pubkey: metaplexId, parsed: json },
            largestHolders: largestHolders.value,
            owner: largestTokenAccount === null || largestTokenAccount === void 0 ? void 0 : largestTokenAccount.owner,
            isOwnerPDA,
        };
    });
}
export const useNameEntryData = (connection, namespaceName, entryName) => {
    const [loadingNameEntry, setLoadingNameEntry] = useState(undefined);
    const [nameEntryData, setNameEntryData] = useState(undefined);
    const refreshNameEntryData = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!entryName || !connection)
            return;
        setLoadingNameEntry(true);
        try {
            const data = yield getNameEntryData(connection, namespaceName, entryName);
            setNameEntryData(data);
        }
        catch (e) {
            setNameEntryData(undefined);
            console.log("Failed to get name entry: ", e);
        }
        finally {
            setLoadingNameEntry(false);
        }
    });
    useMemo(() => __awaiter(void 0, void 0, void 0, function* () {
        refreshNameEntryData();
    }), [connection, namespaceName, entryName]);
    return {
        nameEntryData,
        refreshNameEntryData,
        loadingNameEntry,
    };
};
//# sourceMappingURL=useNameEntryData.js.map