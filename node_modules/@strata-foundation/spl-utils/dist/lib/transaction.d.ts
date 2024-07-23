/// <reference types="node" />
import { Provider } from "@project-serum/anchor";
import { Commitment, Connection, Finality, PublicKey, SendOptions, SignatureStatus, Signer, TransactionInstruction, TransactionSignature } from "@solana/web3.js";
export interface InstructionResult<A> {
    instructions: TransactionInstruction[];
    signers: Signer[];
    output: A;
}
export interface BigInstructionResult<A> {
    instructions: TransactionInstruction[][];
    signers: Signer[][];
    output: A;
}
export declare function sendInstructions(idlErrors: Map<number, string>, provider: Provider, instructions: TransactionInstruction[], signers: Signer[], payer?: PublicKey, commitment?: Commitment): Promise<string>;
export declare function sendMultipleInstructions(idlErrors: Map<number, string>, provider: Provider, instructionGroups: TransactionInstruction[][], signerGroups: Signer[][], payer?: PublicKey, finality?: Finality): Promise<Iterable<string>>;
export declare const awaitTransactionSignatureConfirmation: (txid: TransactionSignature, timeout: number, connection: Connection, commitment?: Commitment, queryStatus?: boolean) => Promise<SignatureStatus | null | void>;
export declare function sendAndConfirmWithRetry(connection: Connection, txn: Buffer, sendOptions: SendOptions, commitment: Commitment, timeout?: number): Promise<{
    txid: string;
}>;
//# sourceMappingURL=transaction.d.ts.map