import { __awaiter } from "tslib";
import { Wallet } from "@project-serum/anchor";
import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
export function getTestConnection() {
    const url = "http://127.0.0.1:8899";
    return new Connection(url, "confirmed");
}
export function newAccountWithLamports(connection, lamports = LAMPORTS_PER_SOL * 10, keypair = Keypair.generate()) {
    return __awaiter(this, void 0, void 0, function* () {
        const account = keypair;
        const signature = yield connection.requestAirdrop(account.publicKey, lamports);
        yield connection.confirmTransaction(signature, "confirmed");
        return account;
    });
}
export function getTestProvider() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = getTestConnection();
        const keypair = yield newAccountWithLamports(connection);
        const wallet = new Wallet(keypair);
        return {
            connection,
            wallet,
        };
    });
}
//# sourceMappingURL=workspace.js.map