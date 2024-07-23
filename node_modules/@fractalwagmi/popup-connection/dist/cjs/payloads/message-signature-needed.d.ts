export interface MessageSignatureNeededPayload extends Record<string, unknown> {
    decodedMessage: string;
}
export declare function assertPayloadIsMessageSignatureNeededPayload(payload: unknown): payload is MessageSignatureNeededPayload;
//# sourceMappingURL=message-signature-needed.d.ts.map