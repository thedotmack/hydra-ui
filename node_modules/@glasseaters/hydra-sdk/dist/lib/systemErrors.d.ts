export declare const LangErrorCode: {
    InstructionMissing: number;
    InstructionFallbackNotFound: number;
    InstructionDidNotDeserialize: number;
    InstructionDidNotSerialize: number;
    IdlInstructionStub: number;
    IdlInstructionInvalidProgram: number;
    ConstraintMut: number;
    ConstraintHasOne: number;
    ConstraintSigner: number;
    ConstraintRaw: number;
    ConstraintOwner: number;
    ConstraintRentExempt: number;
    ConstraintSeeds: number;
    ConstraintExecutable: number;
    ConstraintState: number;
    ConstraintAssociated: number;
    ConstraintAssociatedInit: number;
    ConstraintClose: number;
    ConstraintAddress: number;
    AccountDiscriminatorAlreadySet: number;
    AccountDiscriminatorNotFound: number;
    AccountDiscriminatorMismatch: number;
    AccountDidNotDeserialize: number;
    AccountDidNotSerialize: number;
    AccountNotEnoughKeys: number;
    AccountNotMutable: number;
    AccountNotProgramOwned: number;
    InvalidProgramId: number;
    InvalidProgramIdExecutable: number;
    StateInvalidAddress: number;
    Deprecated: number;
};
export declare const SystemErrorMessage: Map<number, string>;
export declare const LangErrorMessage: Map<number, string>;
export declare class ProgramError {
    readonly code: number;
    readonly msg: string;
    constructor(code: number, msg: string, ...params: any[]);
    static parse(err: any): ProgramError | null;
    toString(): string;
}
//# sourceMappingURL=systemErrors.d.ts.map