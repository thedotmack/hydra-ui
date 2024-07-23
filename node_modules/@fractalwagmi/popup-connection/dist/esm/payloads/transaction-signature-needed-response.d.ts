export interface TransactionSignatureNeededResponsePayload extends Record<string, unknown> {
    signedB58Transactions: string[];
}
export declare function assertPayloadIsTransactionSignatureNeededResponsePayload(payload: unknown): payload is TransactionSignatureNeededResponsePayload;
//# sourceMappingURL=transaction-signature-needed-response.d.ts.map