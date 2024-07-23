import type { AccountData } from "@cardinal/certificates";
import type { ClaimRequestData } from "@cardinal/namespaces";
import type { Connection, PublicKey } from "@solana/web3.js";
export declare const useClaimRequest: (connection: Connection | null, namespaceName: string, entryName: string | undefined, pubkey: PublicKey | undefined) => {
    claimRequest: AccountData<ClaimRequestData> | undefined;
    loadingClaimRequest: boolean | undefined;
    getClaimRequestData: () => Promise<void>;
};
//# sourceMappingURL=useClaimRequest.d.ts.map