import type { AccountData, CertificateData } from "@cardinal/certificates";
import type { EntryData } from "@cardinal/namespaces";
import type { Connection, TokenAccountBalancePair } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
export declare type NameEntryData = {
    nameEntry: AccountData<EntryData>;
    certificate: AccountData<CertificateData>;
    metaplexData: any;
    arweaveData: {
        pubkey: PublicKey;
        parsed: any;
    };
    largestHolders: TokenAccountBalancePair[];
    owner: PublicKey | undefined;
    isOwnerPDA: boolean;
};
export declare function getNameEntryData(connection: Connection, namespaceName: string, entryName: string): Promise<NameEntryData>;
export declare const useNameEntryData: (connection: Connection | null, namespaceName: string, entryName: string | undefined) => {
    nameEntryData: NameEntryData | undefined;
    refreshNameEntryData: () => Promise<void>;
    loadingNameEntry: boolean | undefined;
};
//# sourceMappingURL=useNameEntryData.d.ts.map