import type { AccountData } from "@cardinal/common";
import type { Connection, PublicKey } from "@solana/web3.js";
import type { PaymentManagerData } from ".";
export declare const getPaymentManager: (connection: Connection, paymentManagerId: PublicKey) => Promise<AccountData<PaymentManagerData>>;
//# sourceMappingURL=accounts.d.ts.map