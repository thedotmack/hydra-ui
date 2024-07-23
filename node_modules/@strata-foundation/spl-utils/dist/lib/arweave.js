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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilesWithMetadata = exports.prePayForFilesInstructions = exports.uploadToArweave = exports.ARWEAVE_UPLOAD_URL = exports.AR_SOL_HOLDER_ID = void 0;
const arweave_cost_1 = require("@metaplex/arweave-cost");
const web3_js_1 = require("@solana/web3.js");
const crypto_1 = __importDefault(require("crypto"));
exports.AR_SOL_HOLDER_ID = new web3_js_1.PublicKey("6FKvsq4ydWFci6nGq9ckbjYMtnmaqAoatz5c9XWjiDuS");
exports.ARWEAVE_UPLOAD_URL = process.env.REACT_APP_ARWEAVE_UPLOAD_URL ||
    "https://us-central1-metaplex-studios.cloudfunctions.net/uploadFile";
// export const ARWEAVE_UPLOAD_URL = process.env.REACT_APP_ARWEAVE_UPLOAD_URL || "https://us-central1-principal-lane-200702.cloudfunctions.net/uploadFile4";
const MEMO_ID = new web3_js_1.PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");
function uploadToArweave(txid, mintKey, files, uploadUrl = exports.ARWEAVE_UPLOAD_URL, env = "mainnet-beta") {
    return __awaiter(this, void 0, void 0, function* () {
        // this means we're done getting AR txn setup. Ship it off to ARWeave!
        const data = new FormData();
        data.append("transaction", txid);
        data.append("env", env);
        const tags = files.reduce((acc, f) => {
            acc[f.name] = [{ name: "mint", value: mintKey.toBase58() }];
            return acc;
        }, {});
        data.append("tags", JSON.stringify(tags));
        files.map((f) => data.append("file[]", f));
        // TODO: convert to absolute file name for image
        const resp = yield fetch(uploadUrl, {
            method: "POST",
            // @ts-ignore
            body: data,
        });
        if (!resp.ok) {
            return Promise.reject(new Error("Unable to upload the artwork to Arweave. Please wait and then try again."));
        }
        const result = yield resp.json();
        if (result.error) {
            return Promise.reject(new Error(result.error));
        }
        return result;
    });
}
exports.uploadToArweave = uploadToArweave;
const prePayForFilesInstructions = (payer, files) => __awaiter(void 0, void 0, void 0, function* () {
    const instructions = [];
    const sizes = files.map((f) => f.size);
    const result = yield (0, arweave_cost_1.calculate)(sizes);
    instructions.push(web3_js_1.SystemProgram.transfer({
        fromPubkey: payer,
        toPubkey: exports.AR_SOL_HOLDER_ID,
        lamports: web3_js_1.LAMPORTS_PER_SOL * result.solana,
    }));
    for (let i = 0; i < files.length; i++) {
        const hashSum = crypto_1.default.createHash("sha256");
        hashSum.update(yield files[i].text());
        const hex = hashSum.digest("hex");
        instructions.push(new web3_js_1.TransactionInstruction({
            keys: [],
            programId: MEMO_ID,
            data: Buffer.from(hex),
        }));
    }
    return instructions;
});
exports.prePayForFilesInstructions = prePayForFilesInstructions;
function getFilesWithMetadata(files, metadata) {
    var _a;
    const metadataContent = {
        name: metadata.name,
        symbol: metadata.symbol,
        description: metadata.description,
        seller_fee_basis_points: metadata.sellerFeeBasisPoints,
        image: metadata.image,
        animation_url: metadata.animationUrl,
        external_url: metadata.externalUrl,
        attributes: metadata.attributes,
        properties: Object.assign(Object.assign({}, metadata.properties), { creators: (_a = metadata.creators) === null || _a === void 0 ? void 0 : _a.map((creator) => {
                return {
                    address: creator.address,
                    share: creator.share,
                };
            }) }),
    };
    const realFiles = [
        ...files,
        new File([JSON.stringify(metadataContent)], "metadata.json"),
    ];
    return realFiles;
}
exports.getFilesWithMetadata = getFilesWithMetadata;
//# sourceMappingURL=arweave.js.map