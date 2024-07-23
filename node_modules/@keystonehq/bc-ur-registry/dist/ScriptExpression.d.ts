export declare class ScriptExpression {
    private tag;
    private expression;
    constructor(tag: number, expression: string);
    getTag: () => number;
    getExpression: () => string;
    static fromTag: (tag: number) => ScriptExpression;
}
export declare const ScriptExpressions: {
    SCRIPT_HASH: ScriptExpression;
    WITNESS_SCRIPT_HASH: ScriptExpression;
    PUBLIC_KEY: ScriptExpression;
    PUBLIC_KEY_HASH: ScriptExpression;
    WITNESS_PUBLIC_KEY_HASH: ScriptExpression;
    COMBO: ScriptExpression;
    MULTISIG: ScriptExpression;
    SORTED_MULTISIG: ScriptExpression;
    ADDRESS: ScriptExpression;
    RAW_SCRIPT: ScriptExpression;
};
