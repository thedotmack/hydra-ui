"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMultipleAccounts = exports.chunks = void 0;
const web3_js_1 = require("@solana/web3.js");
const chunks = (array, size) => Array.apply(0, new Array(Math.ceil(array.length / size))).map((_, index) => array.slice(index * size, (index + 1) * size));
exports.chunks = chunks;
const getMultipleAccountsCore = (connection, keys, commitment) => __awaiter(void 0, void 0, void 0, function* () {
    const args = connection._buildArgs([keys], commitment, "base64");
    const unsafeRes = yield connection._rpcRequest("getMultipleAccounts", args);
    if (unsafeRes.error) {
        throw new Error("failed to get info about account " + unsafeRes.error.message);
    }
    if (unsafeRes.result.value) {
        const array = unsafeRes.result.value;
        return { keys, array };
    }
    // TODO: fix
    throw new Error();
});
const getMultipleAccounts = (connection, keys, commitment) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield getMultipleAccountsCore(connection, keys, commitment);
    const array = result.array.map((acc) => {
        if (!acc) {
            return undefined;
        }
        const { data } = acc, rest = __rest(acc, ["data"]);
        const obj = Object.assign(Object.assign({}, rest), { owner: rest.owner && new web3_js_1.PublicKey(rest.owner), data: Buffer.from(data[0], "base64") });
        return obj;
    });
    return { keys, array };
});
exports.getMultipleAccounts = getMultipleAccounts;
//# sourceMappingURL=getMultipleAccounts.js.map