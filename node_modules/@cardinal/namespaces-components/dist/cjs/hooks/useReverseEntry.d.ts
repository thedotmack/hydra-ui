import type { AccountData } from "@cardinal/certificates";
import type { ReverseEntryData } from "@cardinal/namespaces";
import type { Connection, PublicKey } from "@solana/web3.js";
export declare const useReverseEntry: (connection: Connection | null, pubkey: PublicKey | undefined) => {
    reverseEntryData: AccountData<ReverseEntryData> | undefined;
    getReverseEntryData: () => Promise<void>;
    loading: boolean | undefined;
};
//# sourceMappingURL=useReverseEntry.d.ts.map