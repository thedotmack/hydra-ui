/// <reference types="node" />
import { CryptoECKey } from './CryptoECKey';
import { CryptoHDKey } from './CryptoHDKey';
import { DataItem } from './lib';
import { MultiKey } from './MultiKey';
import { RegistryItem } from './RegistryItem';
import { ScriptExpression } from './ScriptExpression';
export declare class CryptoOutput extends RegistryItem {
    private scriptExpressions;
    private cryptoKey;
    getRegistryType: () => import("./RegistryType").RegistryType;
    constructor(scriptExpressions: ScriptExpression[], cryptoKey: CryptoHDKey | CryptoECKey | MultiKey);
    getCryptoKey: () => CryptoHDKey | CryptoECKey | MultiKey;
    getHDKey: () => CryptoHDKey;
    getECKey: () => CryptoECKey;
    getMultiKey: () => MultiKey;
    getScriptExpressions: () => ScriptExpression[];
    private _toOutputDescriptor;
    toString: () => string;
    toDataItem: () => DataItem;
    static fromDataItem: (dataItem: DataItem) => CryptoOutput;
    static fromCBOR: (_cborPayload: Buffer) => CryptoOutput;
}
