"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMintIxs = exports.createMintTx = exports.createMint = void 0;
const tslib_1 = require("tslib");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const transactions_1 = require("./transactions");
/**
 * Build and execute mint Tx
 * @param connection
 * @param wallet
 * @param config
 * @returns
 */
const createMint = (connection, wallet, config) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const mintKeypair = web3_js_1.Keypair.generate();
    const mintId = mintKeypair.publicKey;
    const [tx, ata] = yield (0, exports.createMintTx)(connection, mintKeypair.publicKey, wallet.publicKey, config);
    yield (0, transactions_1.executeTransaction)(connection, tx, wallet, { signers: [mintKeypair] });
    return [ata, mintId];
});
exports.createMint = createMint;
/**
 * Transaction for creating a mint
 * @param connection
 * @param mintId
 * @param authority
 * @param config
 * @returns
 */
const createMintTx = (connection, mintId, authority, config) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const [ixs, ata] = yield (0, exports.createMintIxs)(connection, mintId, authority, config);
    const tx = new web3_js_1.Transaction().add(...ixs);
    return [tx, ata];
});
exports.createMintTx = createMintTx;
/**
 * Instructions for creating a mint
 * @param connection
 * @param mintId
 * @param authority
 * @param config
 * @returns
 */
const createMintIxs = (connection, mintId, authority, config) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const target = (_a = config === null || config === void 0 ? void 0 : config.target) !== null && _a !== void 0 ? _a : authority;
    const ata = (0, spl_token_1.getAssociatedTokenAddressSync)(mintId, target, true);
    return [
        [
            web3_js_1.SystemProgram.createAccount({
                fromPubkey: authority,
                newAccountPubkey: mintId,
                space: spl_token_1.MINT_SIZE,
                lamports: yield (0, spl_token_1.getMinimumBalanceForRentExemptMint)(connection),
                programId: spl_token_1.TOKEN_PROGRAM_ID,
            }),
            (0, spl_token_1.createInitializeMint2Instruction)(mintId, (_b = config === null || config === void 0 ? void 0 : config.decimals) !== null && _b !== void 0 ? _b : 0, authority, authority),
            (0, spl_token_1.createAssociatedTokenAccountInstruction)(authority, ata, target, mintId),
            (0, spl_token_1.createMintToInstruction)(mintId, ata, authority, (_c = config === null || config === void 0 ? void 0 : config.amount) !== null && _c !== void 0 ? _c : 1),
        ],
        ata,
    ];
});
exports.createMintIxs = createMintIxs;
//# sourceMappingURL=mints.js.map