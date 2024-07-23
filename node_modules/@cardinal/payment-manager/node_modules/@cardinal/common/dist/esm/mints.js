import { __awaiter } from "tslib";
import { createAssociatedTokenAccountInstruction, createInitializeMint2Instruction, createMintToInstruction, getAssociatedTokenAddressSync, getMinimumBalanceForRentExemptMint, MINT_SIZE, TOKEN_PROGRAM_ID, } from "@solana/spl-token";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { executeTransaction } from "./transactions";
/**
 * Build and execute mint Tx
 * @param connection
 * @param wallet
 * @param config
 * @returns
 */
export const createMint = (connection, wallet, config) => __awaiter(void 0, void 0, void 0, function* () {
    const mintKeypair = Keypair.generate();
    const mintId = mintKeypair.publicKey;
    const [tx, ata] = yield createMintTx(connection, mintKeypair.publicKey, wallet.publicKey, config);
    yield executeTransaction(connection, tx, wallet, { signers: [mintKeypair] });
    return [ata, mintId];
});
/**
 * Transaction for creating a mint
 * @param connection
 * @param mintId
 * @param authority
 * @param config
 * @returns
 */
export const createMintTx = (connection, mintId, authority, config) => __awaiter(void 0, void 0, void 0, function* () {
    const [ixs, ata] = yield createMintIxs(connection, mintId, authority, config);
    const tx = new Transaction().add(...ixs);
    return [tx, ata];
});
/**
 * Instructions for creating a mint
 * @param connection
 * @param mintId
 * @param authority
 * @param config
 * @returns
 */
export const createMintIxs = (connection, mintId, authority, config) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const target = (_a = config === null || config === void 0 ? void 0 : config.target) !== null && _a !== void 0 ? _a : authority;
    const ata = getAssociatedTokenAddressSync(mintId, target, true);
    return [
        [
            SystemProgram.createAccount({
                fromPubkey: authority,
                newAccountPubkey: mintId,
                space: MINT_SIZE,
                lamports: yield getMinimumBalanceForRentExemptMint(connection),
                programId: TOKEN_PROGRAM_ID,
            }),
            createInitializeMint2Instruction(mintId, (_b = config === null || config === void 0 ? void 0 : config.decimals) !== null && _b !== void 0 ? _b : 0, authority, authority),
            createAssociatedTokenAccountInstruction(authority, ata, target, mintId),
            createMintToInstruction(mintId, ata, authority, (_c = config === null || config === void 0 ? void 0 : config.amount) !== null && _c !== void 0 ? _c : 1),
        ],
        ata,
    ];
});
//# sourceMappingURL=mints.js.map