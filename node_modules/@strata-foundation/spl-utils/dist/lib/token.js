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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssociatedAccountBalance = void 0;
const spl_token_1 = require("@solana/spl-token");
function getAssociatedAccountBalance(connection, account, mint) {
    return __awaiter(this, void 0, void 0, function* () {
        const ata = yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, mint, account, true);
        return (yield connection.getTokenAccountBalance(ata)).value;
    });
}
exports.getAssociatedAccountBalance = getAssociatedAccountBalance;
//# sourceMappingURL=token.js.map