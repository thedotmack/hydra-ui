"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withRemainingAccountsForHandlePaymentWithRoyalties = exports.withRemainingAccountsForPayment = void 0;
const common_1 = require("@cardinal/common");
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const accounts_1 = require("./accounts");
const withRemainingAccountsForPayment = async (transaction, connection, wallet, mint, paymentMint, issuerId, paymentManagerId, buySideTokenAccountId, options) => {
    var _a, _b;
    const payer = (_a = options === null || options === void 0 ? void 0 : options.payer) !== null && _a !== void 0 ? _a : wallet.publicKey;
    const royaltiesRemainingAccounts = await (0, exports.withRemainingAccountsForHandlePaymentWithRoyalties)(transaction, connection, wallet, mint, paymentMint, buySideTokenAccountId, [issuerId.toString()]);
    const mintMetadataId = (0, common_1.findMintMetadataId)(mint);
    const paymentRemainingAccounts = [
        {
            pubkey: paymentMint,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: mint,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: mintMetadataId,
            isSigner: false,
            isWritable: true,
        },
    ];
    if (options === null || options === void 0 ? void 0 : options.receiptMint) {
        const receiptMintLargestAccount = await connection.getTokenLargestAccounts(options.receiptMint);
        // get holder of receipt mint
        const receiptTokenAccountId = (_b = receiptMintLargestAccount.value[0]) === null || _b === void 0 ? void 0 : _b.address;
        if (!receiptTokenAccountId)
            throw new Error("No token accounts found");
        const receiptTokenAccount = await (0, spl_token_1.getAccount)(connection, receiptTokenAccountId);
        // get ATA for this mint of receipt mint holder
        const returnTokenAccountId = receiptTokenAccount.owner.equals(wallet.publicKey)
            ? await (0, common_1.findAta)(paymentMint, receiptTokenAccount.owner, true)
            : await (0, common_1.withFindOrInitAssociatedTokenAccount)(transaction, connection, paymentMint, receiptTokenAccount.owner, payer, true);
        const paymentManager = await (0, common_1.tryNull)((0, accounts_1.getPaymentManager)(connection, paymentManagerId));
        const feeCollectorTokenAccountId = await (0, common_1.withFindOrInitAssociatedTokenAccount)(transaction, connection, paymentMint, paymentManager ? paymentManager.parsed.feeCollector : paymentManagerId, payer, true);
        return [
            returnTokenAccountId,
            feeCollectorTokenAccountId,
            [
                {
                    pubkey: receiptTokenAccountId,
                    isSigner: false,
                    isWritable: true,
                },
                ...paymentRemainingAccounts,
                ...royaltiesRemainingAccounts,
            ],
        ];
    }
    else {
        const issuerTokenAccountId = issuerId.equals(wallet.publicKey)
            ? await (0, common_1.findAta)(paymentMint, issuerId, true)
            : await (0, common_1.withFindOrInitAssociatedTokenAccount)(transaction, connection, paymentMint, issuerId, payer, true);
        const paymentManager = await (0, common_1.tryNull)((0, accounts_1.getPaymentManager)(connection, paymentManagerId));
        const feeCollectorTokenAccountId = await (0, common_1.withFindOrInitAssociatedTokenAccount)(transaction, connection, paymentMint, paymentManager ? paymentManager.parsed.feeCollector : paymentManagerId, payer, true);
        return [
            issuerTokenAccountId,
            feeCollectorTokenAccountId,
            [...paymentRemainingAccounts, ...royaltiesRemainingAccounts],
        ];
    }
};
exports.withRemainingAccountsForPayment = withRemainingAccountsForPayment;
const withRemainingAccountsForHandlePaymentWithRoyalties = async (transaction, connection, wallet, mint, paymentMint, buySideTokenAccountId, excludeCreators) => {
    const remainingAccounts = [];
    let metaplexMintData;
    try {
        const mintMetadataId = (0, common_1.findMintMetadataId)(mint);
        metaplexMintData = await mpl_token_metadata_1.Metadata.fromAccountAddress(connection, mintMetadataId);
    }
    catch (e) {
        // pass
    }
    if (metaplexMintData && metaplexMintData.data.creators) {
        for (const creator of metaplexMintData.data.creators) {
            if (creator.share !== 0) {
                const creatorAddress = new web3_js_1.PublicKey(creator.address);
                if (paymentMint.toString() === web3_js_1.PublicKey.default.toString()) {
                    remainingAccounts.push({
                        pubkey: new web3_js_1.PublicKey(creator.address),
                        isSigner: false,
                        isWritable: true,
                    });
                }
                else {
                    const creatorMintTokenAccount = (excludeCreators === null || excludeCreators === void 0 ? void 0 : excludeCreators.includes(creator.address.toString()))
                        ? await (0, common_1.findAta)(paymentMint, creatorAddress, true)
                        : await (0, common_1.withFindOrInitAssociatedTokenAccount)(transaction, connection, paymentMint, creatorAddress, wallet.publicKey, true);
                    remainingAccounts.push({
                        pubkey: creatorMintTokenAccount,
                        isSigner: false,
                        isWritable: true,
                    });
                }
            }
        }
    }
    return [
        ...remainingAccounts,
        ...(buySideTokenAccountId
            ? [
                {
                    pubkey: buySideTokenAccountId,
                    isSigner: false,
                    isWritable: true,
                },
            ]
            : []),
    ];
};
exports.withRemainingAccountsForHandlePaymentWithRoyalties = withRemainingAccountsForHandlePaymentWithRoyalties;
//# sourceMappingURL=utils.js.map