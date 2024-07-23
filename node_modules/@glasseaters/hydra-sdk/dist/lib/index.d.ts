import * as anchor from "@project-serum/anchor";
import { Provider } from "@project-serum/anchor";
import { Connection, Finality, PublicKey, RpcResponseAndContext, SignatureResult, Signer, Transaction, TransactionInstruction, TransactionSignature } from "@solana/web3.js";
import { MembershipModel } from "./generated/types";
export * from "./generated/types";
export * from "./generated/accounts";
export * from "./generated/errors";
import { BigInstructionResult, InstructionResult } from "@strata-foundation/spl-utils";
interface InitializeFanoutArgs {
    name: string;
    membershipModel: MembershipModel;
    totalShares: number;
    mint?: PublicKey;
}
interface InitializeFanoutForMintArgs {
    fanout: PublicKey;
    mint: PublicKey;
    mintTokenAccount?: PublicKey;
}
interface AddMemberArgs {
    shares: number;
    fanout: PublicKey;
    fanoutNativeAccount?: PublicKey;
    membershipKey: PublicKey;
}
interface StakeMemberArgs {
    shares: number;
    fanout: PublicKey;
    fanoutAuthority?: PublicKey;
    membershipMint?: PublicKey;
    membershipMintTokenAccount?: PublicKey;
    fanoutNativeAccount?: PublicKey;
    member: PublicKey;
    payer: PublicKey;
}
interface SignMetadataArgs {
    fanout: PublicKey;
    authority?: PublicKey;
    holdingAccount?: PublicKey;
    metadata: PublicKey;
}
interface UnstakeMemberArgs {
    fanout: PublicKey;
    membershipMint?: PublicKey;
    membershipMintTokenAccount?: PublicKey;
    fanoutNativeAccount?: PublicKey;
    member: PublicKey;
    payer: PublicKey;
}
interface DistributeMemberArgs {
    distributeForMint: boolean;
    member: PublicKey;
    membershipKey?: PublicKey;
    fanout: PublicKey;
    fanoutMint?: PublicKey;
    payer: PublicKey;
}
interface DistributeTokenMemberArgs {
    distributeForMint: boolean;
    member: PublicKey;
    membershipMint: PublicKey;
    fanout: PublicKey;
    fanoutMint?: PublicKey;
    membershipMintTokenAccount?: PublicKey;
    payer: PublicKey;
}
interface DistributeAllArgs {
    fanout: PublicKey;
    mint: PublicKey;
    payer: PublicKey;
}
export interface TransactionResult {
    RpcResponseAndContext: RpcResponseAndContext<SignatureResult>;
    TransactionSignature: TransactionSignature;
}
export interface Wallet {
    signTransaction(tx: Transaction): Promise<Transaction>;
    signAllTransactions(txs: Transaction[]): Promise<Transaction[]>;
    publicKey: PublicKey;
}
export declare class FanoutClient {
    connection: Connection;
    wallet: Wallet;
    provider: Provider;
    static ID: anchor.web3.PublicKey;
    static init(connection: Connection, wallet: Wallet): Promise<FanoutClient>;
    constructor(connection: Connection, wallet: Wallet);
    fetch<T>(key: PublicKey, type: any): Promise<T>;
    getMembers({ fanout }: {
        fanout: PublicKey;
    }): Promise<PublicKey[]>;
    executeBig<Output>(command: Promise<BigInstructionResult<Output>>, payer?: PublicKey, finality?: Finality): Promise<Output>;
    sendInstructions(instructions: TransactionInstruction[], signers: Signer[], payer?: PublicKey): Promise<TransactionResult>;
    private throwingSend;
    static fanoutKey(name: String, programId?: PublicKey): Promise<[PublicKey, number]>;
    static fanoutForMintKey(fanout: PublicKey, mint: PublicKey, programId?: PublicKey): Promise<[PublicKey, number]>;
    static membershipVoucher(fanout: PublicKey, membershipKey: PublicKey, programId?: PublicKey): Promise<[PublicKey, number]>;
    static mintMembershipVoucher(fanoutForMintConfig: PublicKey, membershipKey: PublicKey, fanoutMint: PublicKey, programId?: PublicKey): Promise<[PublicKey, number]>;
    static freezeAuthority(mint: PublicKey, programId?: PublicKey): Promise<[PublicKey, number]>;
    static nativeAccount(fanoutAccountKey: PublicKey, programId?: PublicKey): Promise<[PublicKey, number]>;
    initializeFanoutInstructions(opts: InitializeFanoutArgs): Promise<InstructionResult<{
        fanout: PublicKey;
        nativeAccount: PublicKey;
    }>>;
    initializeFanoutForMintInstructions(opts: InitializeFanoutForMintArgs): Promise<InstructionResult<{
        fanoutForMint: PublicKey;
        tokenAccount: PublicKey;
    }>>;
    addMemberWalletInstructions(opts: AddMemberArgs): Promise<InstructionResult<{
        membershipAccount: PublicKey;
    }>>;
    addMemberNftInstructions(opts: AddMemberArgs): Promise<InstructionResult<{
        membershipAccount: PublicKey;
    }>>;
    unstakeTokenMemberInstructions(opts: UnstakeMemberArgs): Promise<InstructionResult<{
        membershipVoucher: PublicKey;
        membershipMintTokenAccount: PublicKey;
        stakeAccount: PublicKey;
    }>>;
    stakeForTokenMemberInstructions(opts: StakeMemberArgs): Promise<InstructionResult<{
        membershipVoucher: PublicKey;
        membershipMintTokenAccount: PublicKey;
        stakeAccount: PublicKey;
    }>>;
    stakeTokenMemberInstructions(opts: StakeMemberArgs): Promise<InstructionResult<{
        membershipVoucher: PublicKey;
        membershipMintTokenAccount: PublicKey;
        stakeAccount: PublicKey;
    }>>;
    signMetadataInstructions(opts: SignMetadataArgs): Promise<InstructionResult<{}>>;
    distributeTokenMemberInstructions(opts: DistributeTokenMemberArgs): Promise<InstructionResult<{
        membershipVoucher: PublicKey;
        fanoutForMintMembershipVoucher?: PublicKey;
        holdingAccount: PublicKey;
    }>>;
    distributeAllInstructions({ fanout, mint, payer, }: DistributeAllArgs): Promise<BigInstructionResult<null>>;
    distributeAll(opts: DistributeAllArgs): Promise<null>;
    distributeNftMemberInstructions(opts: DistributeMemberArgs): Promise<InstructionResult<{
        membershipVoucher: PublicKey;
        fanoutForMintMembershipVoucher?: PublicKey;
        holdingAccount: PublicKey;
    }>>;
    distributeWalletMemberInstructions(opts: DistributeMemberArgs): Promise<InstructionResult<{
        membershipVoucher: PublicKey;
        fanoutForMintMembershipVoucher?: PublicKey;
        holdingAccount: PublicKey;
    }>>;
    initializeFanout(opts: InitializeFanoutArgs): Promise<{
        fanout: PublicKey;
        nativeAccount: PublicKey;
    }>;
    initializeFanoutForMint(opts: InitializeFanoutForMintArgs): Promise<{
        fanoutForMint: PublicKey;
        tokenAccount: PublicKey;
    }>;
    addMemberNft(opts: AddMemberArgs): Promise<{
        membershipAccount: PublicKey;
    }>;
    addMemberWallet(opts: AddMemberArgs): Promise<{
        membershipAccount: PublicKey;
    }>;
    stakeTokenMember(opts: StakeMemberArgs): Promise<{
        membershipVoucher: anchor.web3.PublicKey;
        membershipMintTokenAccount: anchor.web3.PublicKey;
        stakeAccount: anchor.web3.PublicKey;
    }>;
    stakeForTokenMember(opts: StakeMemberArgs): Promise<{
        membershipVoucher: anchor.web3.PublicKey;
        membershipMintTokenAccount: anchor.web3.PublicKey;
        stakeAccount: anchor.web3.PublicKey;
    }>;
    signMetadata(opts: SignMetadataArgs): Promise<{}>;
    unstakeTokenMember(opts: UnstakeMemberArgs): Promise<{
        membershipVoucher: anchor.web3.PublicKey;
        membershipMintTokenAccount: anchor.web3.PublicKey;
        stakeAccount: anchor.web3.PublicKey;
    }>;
    distributeNft(opts: DistributeMemberArgs): Promise<{
        membershipVoucher: PublicKey;
        fanoutForMintMembershipVoucher?: PublicKey;
        holdingAccount: PublicKey;
    }>;
    distributeWallet(opts: DistributeMemberArgs): Promise<{
        membershipVoucher: PublicKey;
        fanoutForMintMembershipVoucher?: PublicKey;
        holdingAccount: PublicKey;
    }>;
    distributeToken(opts: DistributeTokenMemberArgs): Promise<{
        membershipVoucher: PublicKey;
        fanoutForMintMembershipVoucher?: PublicKey;
        holdingAccount: PublicKey;
    }>;
}
//# sourceMappingURL=index.d.ts.map