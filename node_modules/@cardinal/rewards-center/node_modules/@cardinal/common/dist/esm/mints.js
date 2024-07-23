import { __awaiter } from "tslib";
import { createCreateOrUpdateInstruction, PROGRAM_ID as TOKEN_AUTH_RULES_ID, } from "@metaplex-foundation/mpl-token-auth-rules";
import { createCreateInstruction, createMintInstruction, TokenStandard, } from "@metaplex-foundation/mpl-token-metadata";
import { encode } from "@msgpack/msgpack";
import { ASSOCIATED_TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, createInitializeMint2Instruction, createMintToInstruction, getAssociatedTokenAddressSync, getMinimumBalanceForRentExemptMint, MINT_SIZE, TOKEN_PROGRAM_ID, } from "@solana/spl-token";
import { Keypair, SystemProgram, SYSVAR_INSTRUCTIONS_PUBKEY, Transaction, } from "@solana/web3.js";
import { findMintEditionId, findMintMetadataId, findRuleSetId, findTokenRecordId, } from "./pda";
import { executeTransaction } from "./transactions";
export const createProgrammableAsset = (connection, wallet, uri = "uri") => __awaiter(void 0, void 0, void 0, function* () {
    const mintKeypair = Keypair.generate();
    const mintId = mintKeypair.publicKey;
    const [tx, ata, rulesetId] = createProgrammableAssetTx(mintKeypair.publicKey, wallet.publicKey, uri);
    yield executeTransaction(connection, tx, wallet, { signers: [mintKeypair] });
    return [ata, mintId, rulesetId];
});
export const createProgrammableAssetTx = (mintId, authority, uri = "uri") => {
    const metadataId = findMintMetadataId(mintId);
    const masterEditionId = findMintEditionId(mintId);
    const ataId = getAssociatedTokenAddressSync(mintId, authority);
    const rulesetName = `rs-${Math.floor(Date.now() / 1000)}`;
    const rulesetId = findRuleSetId(authority, rulesetName);
    const rulesetIx = createCreateOrUpdateInstruction({
        payer: authority,
        ruleSetPda: rulesetId,
    }, {
        createOrUpdateArgs: {
            __kind: "V1",
            serializedRuleSet: encode([
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
    const createIx = createCreateInstruction({
        metadata: metadataId,
        masterEdition: masterEditionId,
        mint: mintId,
        authority: authority,
        payer: authority,
        splTokenProgram: TOKEN_PROGRAM_ID,
        sysvarInstructions: SYSVAR_INSTRUCTIONS_PUBKEY,
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
                tokenStandard: TokenStandard.ProgrammableNonFungible,
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
    const mintIx = createMintInstruction({
        token: ataId,
        tokenOwner: authority,
        metadata: metadataId,
        masterEdition: masterEditionId,
        tokenRecord: findTokenRecordId(mintId, ataId),
        mint: mintId,
        payer: authority,
        authority: authority,
        sysvarInstructions: SYSVAR_INSTRUCTIONS_PUBKEY,
        splAtaProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        splTokenProgram: TOKEN_PROGRAM_ID,
        authorizationRules: rulesetId,
        authorizationRulesProgram: TOKEN_AUTH_RULES_ID,
    }, {
        mintArgs: {
            __kind: "V1",
            amount: 1,
            authorizationData: null,
        },
    });
    return [
        new Transaction().add(rulesetIx, createIxWithSigner, mintIx),
        ataId,
        rulesetId,
    ];
};
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