"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withRelease = exports.withAcceptTransfer = exports.withCancelTransfer = exports.withInitTransfer = exports.withWhitelistMarektplaces = exports.withAcceptListing = exports.withRemoveListing = exports.withUpdateListing = exports.withCreateListing = exports.withUpdateMarketplace = exports.withInitMarketplace = exports.withUpdateTransferAuthority = exports.withInitTransferAuthority = exports.withWrapToken = void 0;
const common_1 = require("@cardinal/common");
const payment_manager_1 = require("@cardinal/payment-manager");
const accounts_1 = require("@cardinal/payment-manager/dist/cjs/accounts");
const pda_1 = require("@cardinal/payment-manager/dist/cjs/pda");
const utils_1 = require("@cardinal/payment-manager/dist/cjs/utils");
const token_1 = require("@project-serum/anchor/dist/cjs/utils/token");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const tokenManager_1 = require("./programs/tokenManager");
const accounts_2 = require("./programs/tokenManager/accounts");
const pda_2 = require("./programs/tokenManager/pda");
const transferAuthority_1 = require("./programs/transferAuthority");
const accounts_3 = require("./programs/transferAuthority/accounts");
const pda_3 = require("./programs/transferAuthority/pda");
const transaction_1 = require("./transaction");
const withWrapToken = async (transaction, connection, wallet, mintId, transferAuthorityInfo, payer = wallet.publicKey) => {
    const tmManagerProgram = (0, tokenManager_1.tokenManagerProgram)(connection, wallet);
    const tokenManagerId = (0, pda_2.findTokenManagerAddress)(mintId);
    const checkTokenManager = await (0, common_1.tryGetAccount)(() => (0, accounts_2.getTokenManager)(connection, tokenManagerId));
    if (checkTokenManager === null || checkTokenManager === void 0 ? void 0 : checkTokenManager.parsed) {
        throw "Token is already wrapped";
    }
    const issuerTokenAccountId = await (0, common_1.findAta)(mintId, wallet.publicKey, true);
    let kind = tokenManager_1.TokenManagerKind.Edition;
    const masterEditionId = (0, common_1.findMintEditionId)(mintId);
    const accountInfo = await connection.getAccountInfo(masterEditionId);
    if (!accountInfo)
        kind = tokenManager_1.TokenManagerKind.Permissioned;
    await (0, transaction_1.withIssueToken)(transaction, connection, wallet, {
        mint: mintId,
        invalidationType: tokenManager_1.InvalidationType.Release,
        issuerTokenAccountId: issuerTokenAccountId,
        kind: kind,
        transferAuthorityInfo: transferAuthorityInfo
            ? {
                transferAuthorityName: transferAuthorityInfo.transferAuthorityName,
                creator: transferAuthorityInfo.creator,
            }
            : undefined,
    }, payer);
    const tokenManagerTokenAccountId = await (0, common_1.findAta)(mintId, tokenManagerId, true);
    const recipientTokenAccountId = await (0, common_1.withFindOrInitAssociatedTokenAccount)(transaction, connection, mintId, wallet.publicKey, payer, true);
    const remainingAccounts = (0, tokenManager_1.getRemainingAccountsForKind)(mintId, kind);
    const claimIx = await tmManagerProgram.methods
        .claim()
        .accounts({
        tokenManager: tokenManagerId,
        tokenManagerTokenAccount: tokenManagerTokenAccountId,
        mint: mintId,
        recipient: wallet.publicKey,
        recipientTokenAccount: recipientTokenAccountId,
        tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
        systemProgram: web3_js_1.SystemProgram.programId,
    })
        .remainingAccounts(remainingAccounts)
        .instruction();
    transaction.add(claimIx);
    return [transaction, tokenManagerId];
};
exports.withWrapToken = withWrapToken;
const withInitTransferAuthority = async (transaction, connection, wallet, name, authority = wallet.publicKey, payer = wallet.publicKey, allowedMarketplaces) => {
    const transferAuthProgram = (0, transferAuthority_1.transferAuthorityProgram)(connection, wallet);
    const transferAuthorityId = (0, pda_3.findTransferAuthorityAddress)(name);
    const initTransferAuthorityIx = await transferAuthProgram.methods
        .initTransferAuthority({
        name: name,
        authority: authority,
        allowedMarketplaces: allowedMarketplaces !== null && allowedMarketplaces !== void 0 ? allowedMarketplaces : null,
    })
        .accounts({
        transferAuthority: transferAuthorityId,
        payer: payer !== null && payer !== void 0 ? payer : wallet.publicKey,
        systemProgram: web3_js_1.SystemProgram.programId,
    })
        .instruction();
    transaction.add(initTransferAuthorityIx);
    return [transaction, transferAuthorityId];
};
exports.withInitTransferAuthority = withInitTransferAuthority;
const withUpdateTransferAuthority = async (transaction, connection, wallet, name, authority, allowedMarketplaces) => {
    const transferAuthProgram = (0, transferAuthority_1.transferAuthorityProgram)(connection, wallet);
    const transferAuthorityId = (0, pda_3.findTransferAuthorityAddress)(name);
    const updateTransferAuthorityIx = await transferAuthProgram.methods
        .updateTransferAuthority({
        authority: authority,
        allowedMarketplaces: allowedMarketplaces,
    })
        .accounts({
        transferAuthority: transferAuthorityId,
        authority: authority,
    })
        .instruction();
    transaction.add(updateTransferAuthorityIx);
    return transaction;
};
exports.withUpdateTransferAuthority = withUpdateTransferAuthority;
const withInitMarketplace = async (transaction, connection, wallet, name, paymentManagerName, paymentMints, payer = wallet.publicKey) => {
    const transferAuthProgram = (0, transferAuthority_1.transferAuthorityProgram)(connection, wallet);
    const marketplaceId = (0, pda_3.findMarketplaceAddress)(name);
    const paymentManagerId = (0, pda_1.findPaymentManagerAddress)(paymentManagerName);
    const initMarketplaceIx = await transferAuthProgram.methods
        .initMarketplace({
        name: name,
        authority: wallet.publicKey,
        paymentMints: paymentMints !== null && paymentMints !== void 0 ? paymentMints : null,
    })
        .accounts({
        marketplace: marketplaceId,
        paymentManager: paymentManagerId,
        payer: payer !== null && payer !== void 0 ? payer : wallet.publicKey,
        systemProgram: web3_js_1.SystemProgram.programId,
    })
        .instruction();
    transaction.add(initMarketplaceIx);
    return [transaction, marketplaceId];
};
exports.withInitMarketplace = withInitMarketplace;
const withUpdateMarketplace = async (transaction, connection, wallet, name, paymentManagerName, authority, paymentMints) => {
    const transferAuthProgram = (0, transferAuthority_1.transferAuthorityProgram)(connection, wallet);
    const marketplaceId = (0, pda_3.findMarketplaceAddress)(name);
    const paymentManagerId = (0, pda_1.findPaymentManagerAddress)(paymentManagerName);
    const updateMarketplaceIx = await transferAuthProgram.methods
        .updateMarketplace({
        paymentManager: paymentManagerId,
        authority: authority,
        paymentMints: paymentMints,
    })
        .accounts({
        marketplace: marketplaceId,
        authority: authority,
    })
        .instruction();
    transaction.add(updateMarketplaceIx);
    return transaction;
};
exports.withUpdateMarketplace = withUpdateMarketplace;
const withCreateListing = async (transaction, connection, wallet, mintId, markeptlaceName, paymentAmount, paymentMint = web3_js_1.PublicKey.default, payer = wallet.publicKey) => {
    const transferAuthProgram = (0, transferAuthority_1.transferAuthorityProgram)(connection, wallet);
    const listingId = (0, pda_3.findListingAddress)(mintId);
    const tokenManagerId = (0, pda_2.findTokenManagerAddress)(mintId);
    const listerTokenAccountId = await (0, common_1.findAta)(mintId, wallet.publicKey, true);
    const marketplaceId = (0, pda_3.findMarketplaceAddress)(markeptlaceName);
    const tokenManagerData = await (0, common_1.tryGetAccount)(() => (0, accounts_2.getTokenManager)(connection, tokenManagerId));
    if (!(tokenManagerData === null || tokenManagerData === void 0 ? void 0 : tokenManagerData.parsed)) {
        throw `No tokenManagerData for mint id${mintId.toString()} found`;
    }
    if (!tokenManagerData.parsed.transferAuthority) {
        throw `No transfer authority for token manager`;
    }
    const checkListing = await (0, common_1.tryGetAccount)(() => (0, accounts_3.getListing)(connection, listingId));
    if (checkListing) {
        transaction.add(await (0, exports.withUpdateListing)(transaction, connection, wallet, mintId, marketplaceId, paymentAmount, paymentMint));
    }
    else {
        const mintManagerId = (0, pda_2.findMintManagerId)(mintId);
        const createListingIx = await transferAuthProgram.methods
            .createListing({
            paymentAmount: paymentAmount,
            paymentMint: paymentMint,
        })
            .accounts({
            listing: listingId,
            transferAuthority: tokenManagerData.parsed.transferAuthority,
            marketplace: marketplaceId,
            tokenManager: tokenManagerId,
            mint: mintId,
            mintManager: mintManagerId,
            listerTokenAccount: listerTokenAccountId,
            lister: wallet.publicKey,
            payer: payer !== null && payer !== void 0 ? payer : wallet.publicKey,
            cardinalTokenManager: tokenManager_1.TOKEN_MANAGER_ADDRESS,
            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
            systemProgram: web3_js_1.SystemProgram.programId,
            instructions: web3_js_1.SYSVAR_INSTRUCTIONS_PUBKEY,
        })
            .instruction();
        transaction.add(createListingIx);
    }
    return [transaction, marketplaceId];
};
exports.withCreateListing = withCreateListing;
const withUpdateListing = async (transaction, connection, wallet, mintId, marketplaceId, paymentAmount, paymentMint) => {
    const transferAuthProgram = (0, transferAuthority_1.transferAuthorityProgram)(connection, wallet);
    const listingData = await (0, common_1.tryGetAccount)(() => (0, accounts_3.getListing)(connection, mintId));
    if (!(listingData === null || listingData === void 0 ? void 0 : listingData.parsed)) {
        throw `No listing found for mint address ${mintId.toString()}`;
    }
    const listerMintTokenAccountId = await (0, common_1.findAta)(mintId, wallet.publicKey, true);
    const listingId = (0, pda_3.findListingAddress)(mintId);
    const updateListingIx = await transferAuthProgram.methods
        .updateListing({
        marketplace: marketplaceId,
        paymentAmount: paymentAmount,
        paymentMint: paymentMint,
    })
        .accounts({
        tokenManager: listingData.parsed.tokenManager,
        listing: listingId,
        listerMintTokenAccount: listerMintTokenAccountId,
        lister: wallet.publicKey,
    })
        .instruction();
    transaction.add(updateListingIx);
    return transaction;
};
exports.withUpdateListing = withUpdateListing;
const withRemoveListing = async (transaction, connection, wallet, mintId, listerMintTokenAccountId) => {
    const transferAuthProgram = (0, transferAuthority_1.transferAuthorityProgram)(connection, wallet);
    const listingId = (0, pda_3.findListingAddress)(mintId);
    const tokenManagerId = (0, pda_2.findTokenManagerAddress)(mintId);
    const mintManagerId = (0, pda_2.findMintManagerId)(mintId);
    const removeListingIx = await transferAuthProgram.methods
        .removeListing()
        .accounts({
        tokenManager: tokenManagerId,
        listing: listingId,
        listerMintTokenAccount: listerMintTokenAccountId,
        lister: wallet.publicKey,
        mint: mintId,
        mintManager: mintManagerId,
        cardinalTokenManager: tokenManager_1.TOKEN_MANAGER_ADDRESS,
        tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
    })
        .instruction();
    transaction.add(removeListingIx);
    return transaction;
};
exports.withRemoveListing = withRemoveListing;
const withAcceptListing = async (transaction, connection, wallet, buyer, mintId, paymentAmount, paymentMint, buySideReceiver, payer = buyer) => {
    const transferAuthProgram = (0, transferAuthority_1.transferAuthorityProgram)(connection, wallet);
    const listingData = await (0, common_1.tryGetAccount)(() => (0, accounts_3.getListing)(connection, mintId));
    if (!(listingData === null || listingData === void 0 ? void 0 : listingData.parsed)) {
        throw `No listing found with mint id ${mintId.toString()}`;
    }
    const marketplaceData = await (0, common_1.tryGetAccount)(() => (0, accounts_3.getMarketplace)(connection, listingData.parsed.marketplace));
    if (!(marketplaceData === null || marketplaceData === void 0 ? void 0 : marketplaceData.parsed)) {
        throw `No marketplace found with id ${mintId.toString()}`;
    }
    const paymentManagerData = await (0, common_1.tryGetAccount)(() => (0, accounts_1.getPaymentManager)(connection, marketplaceData.parsed.paymentManager));
    if (!(paymentManagerData === null || paymentManagerData === void 0 ? void 0 : paymentManagerData.parsed)) {
        throw `No payment manager found for marketplace with name ${marketplaceData.parsed.name}`;
    }
    const nativePayment = paymentMint.toString() === web3_js_1.PublicKey.default.toString();
    const listerPaymentTokenAccountId = nativePayment
        ? listingData.parsed.lister
        : await (0, common_1.withFindOrInitAssociatedTokenAccount)(transaction, connection, listingData.parsed.paymentMint, listingData.parsed.lister, wallet.publicKey);
    const listerMintTokenAccountId = await (0, common_1.findAta)(mintId, listingData.parsed.lister, true);
    const payerPaymentTokenAccountId = nativePayment
        ? payer
        : listingData.parsed.lister.toString() !== payer.toString()
            ? await (0, common_1.withFindOrInitAssociatedTokenAccount)(transaction, connection, listingData.parsed.paymentMint, payer, wallet.publicKey)
            : listerPaymentTokenAccountId;
    if (listingData.parsed.paymentMint.toString() === transferAuthority_1.WSOL_MINT.toString()) {
        await (0, common_1.withWrapSol)(transaction, connection, (0, common_1.emptyWallet)(buyer), listingData.parsed.paymentAmount.toNumber(), true);
    }
    const buyerMintTokenAccountId = listingData.parsed.lister.toString() === buyer.toString()
        ? await (0, common_1.findAta)(mintId, buyer, true)
        : await (0, common_1.withFindOrInitAssociatedTokenAccount)(transaction, connection, mintId, buyer, wallet.publicKey, true);
    const feeCollectorTokenAccountId = nativePayment
        ? paymentManagerData === null || paymentManagerData === void 0 ? void 0 : paymentManagerData.parsed.feeCollector
        : await (0, common_1.withFindOrInitAssociatedTokenAccount)(transaction, connection, listingData.parsed.paymentMint, paymentManagerData === null || paymentManagerData === void 0 ? void 0 : paymentManagerData.parsed.feeCollector, wallet.publicKey, true);
    const mintMetadataId = (0, common_1.findMintMetadataId)(mintId);
    const tokenManagerId = (0, pda_2.findTokenManagerAddress)(mintId);
    const transferReceiptId = (0, pda_2.findTransferReceiptId)(tokenManagerId);
    const remainingAccountsForHandlePaymentWithRoyalties = await (0, utils_1.withRemainingAccountsForHandlePaymentWithRoyalties)(transaction, connection, wallet, mintId, listingData.parsed.paymentMint, buySideReceiver, [listingData.parsed.lister.toString(), buyer.toString()]);
    const tokenManagerData = await (0, accounts_2.getTokenManager)(connection, tokenManagerId);
    if (!tokenManagerData) {
        throw `No token manager found for ${mintId.toString()}`;
    }
    if (!tokenManagerData.parsed.transferAuthority) {
        throw `No transfer authority for token manager`;
    }
    const remainingAccountsForKind = (0, tokenManager_1.getRemainingAccountsForKind)(mintId, tokenManagerData.parsed.kind);
    const remainingAccounts = [
        ...remainingAccountsForHandlePaymentWithRoyalties,
        ...remainingAccountsForKind,
    ];
    if ((paymentAmount && !paymentAmount.eq(listingData.parsed.paymentAmount)) ||
        (paymentMint && !paymentMint.equals(listingData.parsed.paymentMint))) {
        throw "Listing data does not match expected values";
    }
    const acceptListingIx = await transferAuthProgram.methods
        .acceptListing({
        paymentAmount: paymentAmount,
    })
        .accounts({
        transferAuthority: tokenManagerData.parsed.transferAuthority,
        transferReceipt: transferReceiptId,
        listing: listingData.pubkey,
        listerPaymentTokenAccount: listerPaymentTokenAccountId,
        listerMintTokenAccount: listerMintTokenAccountId,
        lister: listingData.parsed.lister,
        buyerMintTokenAccount: buyerMintTokenAccountId,
        buyer: buyer,
        payer: payer !== null && payer !== void 0 ? payer : buyer,
        payerPaymentTokenAccount: payerPaymentTokenAccountId,
        marketplace: marketplaceData.pubkey,
        tokenManager: tokenManagerData.pubkey,
        mint: tokenManagerData.parsed.mint,
        mintMetadataInfo: mintMetadataId,
        paymentManager: marketplaceData.parsed.paymentManager,
        paymentMint: paymentMint,
        feeCollectorTokenAccount: feeCollectorTokenAccountId,
        feeCollector: paymentManagerData.parsed.feeCollector,
        cardinalPaymentManager: payment_manager_1.PAYMENT_MANAGER_ADDRESS,
        cardinalTokenManager: tokenManager_1.TOKEN_MANAGER_ADDRESS,
        associatedTokenProgram: token_1.ASSOCIATED_PROGRAM_ID,
        tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
        systemProgram: web3_js_1.SystemProgram.programId,
        instructions: web3_js_1.SYSVAR_INSTRUCTIONS_PUBKEY,
    })
        .remainingAccounts(remainingAccounts)
        .instruction();
    transaction.add(acceptListingIx);
    return transaction;
};
exports.withAcceptListing = withAcceptListing;
const withWhitelistMarektplaces = async (transaction, connection, wallet, transferAuthorityName, marketplaceNames) => {
    const transferAuthProgram = (0, transferAuthority_1.transferAuthorityProgram)(connection, wallet);
    const transferAuthority = (0, pda_3.findTransferAuthorityAddress)(transferAuthorityName);
    const marketplaceIds = marketplaceNames.map((name) => (0, pda_3.findMarketplaceAddress)(name));
    const whitelistMarketplaceIx = await transferAuthProgram.methods
        .whitelistMarketplaces({
        allowedMarketplaces: marketplaceIds,
    })
        .accounts({
        transferAuthority: transferAuthority,
        authority: wallet.publicKey,
    })
        .instruction();
    transaction.add(whitelistMarketplaceIx);
    return transaction;
};
exports.withWhitelistMarektplaces = withWhitelistMarektplaces;
const withInitTransfer = async (transaction, connection, wallet, to, mintId, holderTokenAccountId, payer = wallet.publicKey) => {
    const transferAuthProgram = (0, transferAuthority_1.transferAuthorityProgram)(connection, wallet);
    const transferId = (0, pda_3.findTransferAddress)(mintId);
    const tokenManagerId = (0, pda_2.findTokenManagerAddress)(mintId);
    const initTransferIx = await transferAuthProgram.methods
        .initTransfer({
        to: to,
    })
        .accounts({
        transfer: transferId,
        tokenManager: tokenManagerId,
        holderTokenAccount: holderTokenAccountId,
        holder: wallet.publicKey,
        payer: payer !== null && payer !== void 0 ? payer : wallet.publicKey,
        systemProgram: web3_js_1.SystemProgram.programId,
    })
        .instruction();
    transaction.add(initTransferIx);
    return transaction;
};
exports.withInitTransfer = withInitTransfer;
const withCancelTransfer = async (transaction, connection, wallet, mintId) => {
    const transferAuthProgram = (0, transferAuthority_1.transferAuthorityProgram)(connection, wallet);
    const transferId = (0, pda_3.findTransferAddress)(mintId);
    const tokenManagerId = (0, pda_2.findTokenManagerAddress)(mintId);
    const checkTokenManager = await (0, common_1.tryGetAccount)(() => (0, accounts_2.getTokenManager)(connection, tokenManagerId));
    if (!checkTokenManager) {
        throw `No token manager found for mint id ${mintId.toString()}`;
    }
    const cancelTransferIx = await transferAuthProgram.methods
        .cancelTransfer()
        .accounts({
        transfer: transferId,
        tokenManager: tokenManagerId,
        holderTokenAccount: checkTokenManager.parsed.recipientTokenAccount,
        holder: wallet.publicKey,
    })
        .instruction();
    transaction.add(cancelTransferIx);
    return transaction;
};
exports.withCancelTransfer = withCancelTransfer;
const withAcceptTransfer = async (transaction, connection, wallet, mintId, recipient, holder) => {
    const transferAuthProgram = (0, transferAuthority_1.transferAuthorityProgram)(connection, wallet);
    const transferId = (0, pda_3.findTransferAddress)(mintId);
    const tokenManagerId = (0, pda_2.findTokenManagerAddress)(mintId);
    const transferReceiptId = (0, pda_2.findTransferReceiptId)(tokenManagerId);
    const listingId = (0, pda_3.findListingAddress)(mintId);
    const tokenManagerData = await (0, common_1.tryGetAccount)(() => (0, accounts_2.getTokenManager)(connection, tokenManagerId));
    if (!tokenManagerData) {
        throw `No token manager found for mint ${mintId.toString()}`;
    }
    if (!tokenManagerData.parsed.transferAuthority) {
        throw `No transfer autority found for mint id ${mintId.toString()}`;
    }
    const recipientTokenAccountId = await (0, common_1.findAta)(mintId, recipient, true);
    const remainingAccountsForTransfer = [
        ...(0, tokenManager_1.getRemainingAccountsForKind)(mintId, tokenManagerData.parsed.kind),
        {
            pubkey: transferReceiptId,
            isSigner: false,
            isWritable: true,
        },
    ];
    const accceptTransferIx = await transferAuthProgram.methods
        .acceptTransfer()
        .accounts({
        transfer: transferId,
        transferAuthority: tokenManagerData.parsed.transferAuthority,
        transferReceipt: transferReceiptId,
        listing: listingId,
        tokenManager: tokenManagerId,
        mint: mintId,
        recipientTokenAccount: recipientTokenAccountId,
        recipient: recipient,
        payer: wallet.publicKey,
        holderTokenAccount: tokenManagerData.parsed.recipientTokenAccount,
        holder: holder,
        cardinalTokenManager: tokenManager_1.TOKEN_MANAGER_ADDRESS,
        associatedTokenProgram: spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
        systemProgram: web3_js_1.SystemProgram.programId,
        rent: web3_js_1.SYSVAR_RENT_PUBKEY,
        instructions: web3_js_1.SYSVAR_INSTRUCTIONS_PUBKEY,
    })
        .remainingAccounts(remainingAccountsForTransfer)
        .instruction();
    transaction.add(accceptTransferIx);
    return transaction;
};
exports.withAcceptTransfer = withAcceptTransfer;
const withRelease = async (transaction, connection, wallet, mintId, transferAuthorityId, holderTokenAccountId, payer = wallet.publicKey) => {
    const transferAuthProgram = (0, transferAuthority_1.transferAuthorityProgram)(connection, wallet);
    const tokenManagerId = (0, pda_2.findTokenManagerAddress)(mintId);
    const checkTokenManager = await (0, common_1.tryGetAccount)(() => (0, accounts_2.getTokenManager)(connection, tokenManagerId));
    if (!checkTokenManager) {
        throw `No token manager found for mint id ${mintId.toString()}`;
    }
    const tokenManagerTokenAccountId = await (0, common_1.withFindOrInitAssociatedTokenAccount)(transaction, connection, mintId, tokenManagerId, payer, true);
    const tokenManagerData = await (0, accounts_2.getTokenManager)(connection, tokenManagerId);
    const remainingAccountsForKind = (0, tokenManager_1.getRemainingAccountsForKind)(mintId, tokenManagerData.parsed.kind);
    const remainingAccountsForReturn = await (0, tokenManager_1.withRemainingAccountsForReturn)(transaction, connection, wallet, tokenManagerData);
    const releaseIx = await transferAuthProgram.methods
        .release()
        .accounts({
        transferAuthority: transferAuthorityId,
        tokenManager: tokenManagerId,
        mint: mintId,
        tokenManagerTokenAccount: tokenManagerTokenAccountId,
        holderTokenAccount: holderTokenAccountId,
        holder: wallet.publicKey,
        collector: wallet.publicKey,
        cardinalTokenManager: tokenManager_1.TOKEN_MANAGER_ADDRESS,
        tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
        rent: web3_js_1.SYSVAR_RENT_PUBKEY,
    })
        .remainingAccounts([
        ...remainingAccountsForKind,
        ...remainingAccountsForReturn,
    ])
        .instruction();
    transaction.add(releaseIx);
    return transaction;
};
exports.withRelease = withRelease;
//# sourceMappingURL=marketplace.js.map