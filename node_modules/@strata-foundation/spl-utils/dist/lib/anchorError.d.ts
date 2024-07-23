export declare const SystemErrorMessage: Map<number, string>;
export declare class ProgramError {
    readonly code: number;
    readonly msg: string;
    constructor(code: number, msg: string, ...params: any[]);
    static parse(err: any, idlErrors: Map<number, string>): ProgramError | null;
    toString(): string;
}
//# sourceMappingURL=anchorError.d.ts.map