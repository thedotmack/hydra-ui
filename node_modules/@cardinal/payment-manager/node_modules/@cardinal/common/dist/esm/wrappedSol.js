import { __awaiter } from "tslib";
import * as BufferLayout from "@solana/buffer-layout";
import * as splToken from "@solana/spl-token";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import * as web3 from "@solana/web3.js";
import { withFindOrInitAssociatedTokenAccount } from "./transactions";
export function withWrapSol(transaction, connection, wallet, lamports, skipInitTokenAccount = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const nativeAssociatedTokenAccountId = skipInitTokenAccount
            ? getAssociatedTokenAddressSync(splToken.NATIVE_MINT, wallet.publicKey, true)
            : yield withFindOrInitAssociatedTokenAccount(transaction, connection, splToken.NATIVE_MINT, wallet.publicKey, wallet.publicKey);
        transaction.add(web3.SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: nativeAssociatedTokenAccountId,
            lamports,
        }));
        transaction.add(createSyncNativeInstruction(nativeAssociatedTokenAccountId));
        return transaction;
    });
}
export function createSyncNativeInstruction(nativeAccount) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const dataLayout = BufferLayout.struct([BufferLayout.u8("instruction")]);
    const data = Buffer.alloc(dataLayout.span);
    dataLayout.encode({
        instruction: 17, // SyncNative instruction
    }, data);
    const keys = [{ pubkey: nativeAccount, isSigner: false, isWritable: true }];
    return new web3.TransactionInstruction({
        keys,
        programId: splToken.TOKEN_PROGRAM_ID,
        data,
    });
}
//# sourceMappingURL=wrappedSol.js.map