export interface TransactionSignatureNeededPayload extends Record<string, unknown> {
    unsignedB58Transactions: string[];
}
export declare function assertPayloadIsTransactionSignatureNeededPayload(payload: unknown): payload is TransactionSignatureNeededPayload;
//# sourceMappingURL=transaction-signature-needed.d.ts.map