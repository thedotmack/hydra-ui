"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendBorsh = void 0;
const web3_js_1 = require("@solana/web3.js");
const borsh_1 = require("borsh");
const bs58_1 = __importDefault(require("bs58"));
const extendBorsh = () => {
    borsh_1.BinaryReader.prototype.readPubkey = function () {
        const reader = this;
        const array = reader.readFixedArray(32);
        return new web3_js_1.PublicKey(array);
    };
    borsh_1.BinaryWriter.prototype.writePubkey = function (value) {
        const writer = this;
        writer.writeFixedArray(value.toBuffer());
    };
    borsh_1.BinaryReader.prototype.readPubkeyAsString = function () {
        const reader = this;
        const array = reader.readFixedArray(32);
        return bs58_1.default.encode(array);
    };
    borsh_1.BinaryWriter.prototype.writePubkeyAsString = function (value) {
        const writer = this;
        writer.writeFixedArray(bs58_1.default.decode(value));
    };
};
exports.extendBorsh = extendBorsh;
(0, exports.extendBorsh)();
//# sourceMappingURL=extendBorsh.js.map