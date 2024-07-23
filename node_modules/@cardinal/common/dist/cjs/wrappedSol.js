"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSyncNativeInstruction = exports.withWrapSol = void 0;
const tslib_1 = require("tslib");
const BufferLayout = tslib_1.__importStar(require("@solana/buffer-layout"));
const splToken = tslib_1.__importStar(require("@solana/spl-token"));
const spl_token_1 = require("@solana/spl-token");
const web3 = tslib_1.__importStar(require("@solana/web3.js"));
const transactions_1 = require("./transactions");
function withWrapSol(transaction, connection, wallet, lamports, skipInitTokenAccount = false) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const nativeAssociatedTokenAccountId = skipInitTokenAccount
            ? (0, spl_token_1.getAssociatedTokenAddressSync)(splToken.NATIVE_MINT, wallet.publicKey, true)
            : yield (0, transactions_1.withFindOrInitAssociatedTokenAccount)(transaction, connection, splToken.NATIVE_MINT, wallet.publicKey, wallet.publicKey);
        transaction.add(web3.SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: nativeAssociatedTokenAccountId,
            lamports,
        }));
        transaction.add(createSyncNativeInstruction(nativeAssociatedTokenAccountId));
        return transaction;
    });
}
exports.withWrapSol = withWrapSol;
function createSyncNativeInstruction(nativeAccount) {
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
exports.createSyncNativeInstruction = createSyncNativeInstruction;
//# sourceMappingURL=wrappedSol.js.map