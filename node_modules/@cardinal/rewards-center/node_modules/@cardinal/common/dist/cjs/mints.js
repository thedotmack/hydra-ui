"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMintIxs = exports.createMintTx = exports.createMint = exports.createProgrammableAssetTx = exports.createProgrammableAsset = void 0;
const tslib_1 = require("tslib");
const mpl_token_auth_rules_1 = require("@metaplex-foundation/mpl-token-auth-rules");
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
const msgpack_1 = require("@msgpack/msgpack");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const pda_1 = require("./pda");
const transactions_1 = require("./transactions");
const createProgrammableAsset = (connection, wallet, uri = "uri") => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const mintKeypair = web3_js_1.Keypair.generate();
    const mintId = mintKeypair.publicKey;
    const [tx, ata, rulesetId] = (0, exports.createProgrammableAssetTx)(mintKeypair.publicKey, wallet.publicKey, uri);
    yield (0, transactions_1.executeTransaction)(connection, tx, wallet, { signers: [mintKeypair] });
    return [ata, mintId, rulesetId];
});
exports.createProgrammableAsset = createProgrammableAsset;
const createProgrammableAssetTx = (mintId, authority, uri = "uri") => {
    const metadataId = (0, pda_1.findMintMetadataId)(mintId);
    const masterEditionId = (0, pda_1.findMintEditionId)(mintId);
    const ataId = (0, spl_token_1.getAssociatedTokenAddressSync)(mintId, authority);
    const rulesetName = `rs-${Math.floor(Date.now() / 1000)}`;
    const rulesetId = (0, pda_1.findRuleSetId)(authority, rulesetName);
    const rulesetIx = (0, mpl_token_auth_rules_1.createCreateOrUpdateInstruction)({
        payer: authority,
        ruleSetPda: rulesetId,
    }, {
        createOrUpdateArgs: {
            __kind: "V1",
            serializedRuleSet: (0, msgpack_1.encode)([
                1,
                authority.toBuffer().reduce((acc, i) => {
                    acc.push(i);
                    return acc;
                }, []),
                rulesetName,
                {
                    "Delegate:Staking": "Pass",
                    "Transfer:WalletToWallet": "Pass",
                    "Transfer:Owner": "Pass",
                    "Transfer:Delegate": "Pass",
                    "Transfer:TransferDelegate": "Pass",
                    "Delegate:LockedTransfer": "Pass",
                },
            ]),
        },
    });
    const createIx = (0, mpl_token_metadata_1.createCreateInstruction)({
        metadata: metadataId,
        masterEdition: masterEditionId,
        mint: mintId,
        authority: authority,
        payer: authority,
        splTokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
        sysvarInstructions: web3_js_1.SYSVAR_INSTRUCTIONS_PUBKEY,
        updateAuthority: authority,
    }, {
        createArgs: {
            __kind: "V1",
            assetData: {
                name: `NFT - ${Math.floor(Date.now() / 1000)}`,
                symbol: "PNF",
                uri: uri,
                sellerFeeBasisPoints: 0,
                creators: [
                    {
                        address: authority,
                        share: 100,
                        verified: false,
                    },
                ],
                primarySaleHappened: false,
                isMutable: true,
                tokenStandard: mpl_token_metadata_1.TokenStandard.ProgrammableNonFungible,
                collection: null,
                uses: null,
                collectionDetails: null,
                ruleSet: rulesetId,
            },
            decimals: 0,
            printSupply: { __kind: "Zero" },
        },
    });
    const createIxWithSigner = Object.assign(Object.assign({}, createIx), { keys: createIx.keys.map((k) => k.pubkey.toString() === mintId.toString() ? Object.assign(Object.assign({}, k), { isSigner: true }) : k) });
    const mintIx = (0, mpl_token_metadata_1.createMintInstruction)({
        token: ataId,
        tokenOwner: authority,
        metadata: metadataId,
        masterEdition: masterEditionId,
        tokenRecord: (0, pda_1.findTokenRecordId)(mintId, ataId),
        mint: mintId,
        payer: authority,
        authority: authority,
        sysvarInstructions: web3_js_1.SYSVAR_INSTRUCTIONS_PUBKEY,
        splAtaProgram: spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID,
        splTokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
        authorizationRules: rulesetId,
        authorizationRulesProgram: mpl_token_auth_rules_1.PROGRAM_ID,
    }, {
        mintArgs: {
            __kind: "V1",
            amount: 1,
            authorizationData: null,
        },
    });
    return [
        new web3_js_1.Transaction().add(rulesetIx, createIxWithSigner, mintIx),
        ataId,
        rulesetId,
    ];
};
exports.createProgrammableAssetTx = createProgrammableAssetTx;
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