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
exports.SplTokenMetadata = exports.getImageFromMeta = exports.MetadataCategory = exports.StorageProvider = void 0;
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
const web3_js_1 = require("@solana/web3.js");
const _1 = require(".");
const arweave_1 = require("./arweave");
// @ts-ignore
const localstorage_memory_1 = __importDefault(require("localstorage-memory"));
var StorageProvider;
(function (StorageProvider) {
    StorageProvider["Arweave"] = "arweave";
})(StorageProvider = exports.StorageProvider || (exports.StorageProvider = {}));
var MetadataCategory;
(function (MetadataCategory) {
    MetadataCategory["Audio"] = "audio";
    MetadataCategory["Video"] = "video";
    MetadataCategory["Image"] = "image";
    MetadataCategory["VR"] = "vr";
})(MetadataCategory = exports.MetadataCategory || (exports.MetadataCategory = {}));
const USE_CDN = false; // copied from metaplex. Guess support isn't there yet?
const routeCDN = (uri) => {
    let result = uri;
    if (USE_CDN) {
        result = uri.replace("https://arweave.net/", "https://coldcdn.com/api/cdn/bronil/");
    }
    return result;
};
function getImageFromMeta(meta) {
    var _a, _b;
    if (meta === null || meta === void 0 ? void 0 : meta.image) {
        return meta === null || meta === void 0 ? void 0 : meta.image;
    }
    else {
        const found = (_b = (((_a = meta === null || meta === void 0 ? void 0 : meta.properties) === null || _a === void 0 ? void 0 : _a.files) || []).find((f) => typeof f !== "string" && f.type === "Ima")) === null || _b === void 0 ? void 0 : _b.uri;
        return found;
    }
}
exports.getImageFromMeta = getImageFromMeta;
const imageFromJson = (newUri, extended) => {
    const image = getImageFromMeta(extended);
    if (image) {
        const file = image.startsWith("http")
            ? extended.image
            : `${newUri}/${extended.image}`;
        return routeCDN(file);
    }
};
const localStorage = global.localStorage || localstorage_memory_1.default;
class SplTokenMetadata {
    constructor(opts) {
        this.provider = opts.provider;
    }
    static init(provider) {
        return __awaiter(this, void 0, void 0, function* () {
            return new this({
                provider,
            });
        });
    }
    static attributesToRecord(attributes) {
        if (!attributes) {
            return undefined;
        }
        return attributes === null || attributes === void 0 ? void 0 : attributes.reduce((acc, att) => {
            if (att.trait_type)
                acc[att.trait_type] = att.value;
            return acc;
        }, {});
    }
    static getArweaveMetadata(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            if (uri) {
                const newUri = routeCDN(uri);
                const cached = localStorage.getItem(newUri);
                if (cached) {
                    return JSON.parse(cached);
                }
                else {
                    try {
                        // TODO: BL handle concurrent calls to avoid double query
                        const result = yield fetch(newUri);
                        let data = yield result.json();
                        if (data.uri) {
                            data = Object.assign(Object.assign({}, data), (yield SplTokenMetadata.getArweaveMetadata(data.uri)));
                        }
                        try {
                            localStorage.setItem(newUri, JSON.stringify(data));
                        }
                        catch (e) {
                            // ignore
                        }
                        return data;
                    }
                    catch (e) {
                        console.log(`Could not fetch from ${uri}`, e);
                        return undefined;
                    }
                }
            }
        });
    }
    static getImage(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            if (uri) {
                const newUri = routeCDN(uri);
                const metadata = yield SplTokenMetadata.getArweaveMetadata(uri);
                // @ts-ignore
                if (metadata === null || metadata === void 0 ? void 0 : metadata.uri) {
                    // @ts-ignore
                    return SplTokenMetadata.getImage(metadata === null || metadata === void 0 ? void 0 : metadata.uri);
                }
                return imageFromJson(newUri, metadata);
            }
        });
    }
    getEditionInfo(metadata) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!metadata) {
                return {};
            }
            const editionKey = yield mpl_token_metadata_1.Edition.getPDA(new web3_js_1.PublicKey(metadata.mint));
            let edition;
            let masterEdition;
            const editionOrMasterEditionAcct = yield this.provider.connection.getAccountInfo(editionKey);
            const editionOrMasterEdition = editionOrMasterEditionAcct
                ? (editionOrMasterEditionAcct === null || editionOrMasterEditionAcct === void 0 ? void 0 : editionOrMasterEditionAcct.data[0]) == mpl_token_metadata_1.MetadataKey.EditionV1
                    ? new mpl_token_metadata_1.Edition(editionKey, editionOrMasterEditionAcct)
                    : new mpl_token_metadata_1.MasterEdition(editionKey, editionOrMasterEditionAcct)
                : null;
            if (editionOrMasterEdition instanceof mpl_token_metadata_1.Edition) {
                edition = editionOrMasterEdition;
                const masterEditionInfoAcct = yield this.provider.connection.getAccountInfo(new web3_js_1.PublicKey(editionOrMasterEdition.data.parent));
                masterEdition =
                    masterEditionInfoAcct &&
                        new mpl_token_metadata_1.MasterEdition(new web3_js_1.PublicKey(editionOrMasterEdition.data.parent), masterEditionInfoAcct);
            }
            else {
                masterEdition = editionOrMasterEdition;
            }
            return {
                edition: edition === null || edition === void 0 ? void 0 : edition.data,
                masterEdition: (masterEdition === null || masterEdition === void 0 ? void 0 : masterEdition.data) || undefined,
            };
        });
    }
    getTokenMetadata(metadataKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const metadataAcc = yield this.provider.connection.getAccountInfo(metadataKey);
            const metadata = metadataAcc && new mpl_token_metadata_1.Metadata(metadataKey, metadataAcc).data;
            const data = yield SplTokenMetadata.getArweaveMetadata(metadata === null || metadata === void 0 ? void 0 : metadata.data.uri);
            const image = yield SplTokenMetadata.getImage(metadata === null || metadata === void 0 ? void 0 : metadata.data.uri);
            const description = data === null || data === void 0 ? void 0 : data.description;
            const mint = metadata &&
                (yield (0, _1.getMintInfo)(this.provider, new web3_js_1.PublicKey(metadata.mint)));
            const displayName = (metadata === null || metadata === void 0 ? void 0 : metadata.data.name.length) == 32 ? data === null || data === void 0 ? void 0 : data.name : metadata === null || metadata === void 0 ? void 0 : metadata.data.name;
            return Object.assign({ displayName, metadata: metadata || undefined, metadataKey,
                image, mint: mint || undefined, data,
                description }, (metadata ? yield this.getEditionInfo(metadata) : {}));
        });
    }
    sendInstructions(instructions, signers, payer) {
        return (0, _1.sendInstructions)(new Map(), this.provider, instructions, signers, payer);
    }
    uploadMetadata(args) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return this.createArweaveMetadata(Object.assign(Object.assign({}, args), { image: (_a = args.image) === null || _a === void 0 ? void 0 : _a.name, files: [args.image].filter(_1.truthy), mint: args.mint }));
        });
    }
    /**
     * Wrapper function that prepays for arweave metadata files in SOL, then uploads them to arweave and returns the url
     *
     * @param args
     * @returns
     */
    createArweaveMetadata(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const { txid, files } = yield this.presignCreateArweaveUrl(args);
            let env = args.env;
            if (!env) {
                // @ts-ignore
                const url = this.provider.connection._rpcEndpoint;
                if (url.includes("devnet")) {
                    env = "devnet";
                }
                else {
                    env = "mainnet-beta";
                }
            }
            const uri = yield this.getArweaveUrl({
                txid,
                mint: args.mint,
                files,
                env,
                uploadUrl: args.uploadUrl || arweave_1.ARWEAVE_UPLOAD_URL,
            });
            return uri;
        });
    }
    presignCreateArweaveUrlInstructions({ name, symbol, description = "", image, creators, files = [], payer = this.provider.wallet.publicKey, existingFiles, attributes, externalUrl, animationUrl, extraMetadata, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const metadata = Object.assign({ name,
                symbol,
                description,
                image,
                attributes, externalUrl: externalUrl || "", animationUrl, properties: {
                    category: MetadataCategory.Image,
                    files: [...(existingFiles || []), ...files],
                }, creators: creators ? creators : null, sellerFeeBasisPoints: 0 }, (extraMetadata || {}));
            const realFiles = yield (0, arweave_1.getFilesWithMetadata)(files, metadata);
            const prepayTxnInstructions = yield (0, arweave_1.prePayForFilesInstructions)(payer, realFiles);
            return {
                instructions: prepayTxnInstructions,
                signers: [],
                output: {
                    files: realFiles,
                },
            };
        });
    }
    presignCreateArweaveUrl(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const { output: { files }, instructions, signers, } = yield this.presignCreateArweaveUrlInstructions(args);
            const txid = yield this.sendInstructions(instructions, signers);
            return {
                files,
                txid,
            };
        });
    }
    getArweaveUrl({ txid, mint, files = [], uploadUrl = arweave_1.ARWEAVE_UPLOAD_URL, env = "mainnet-beta", }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, arweave_1.uploadToArweave)(txid, mint, files, uploadUrl, env);
            const metadataFile = (_a = result.messages) === null || _a === void 0 ? void 0 : _a.find((m) => m.filename === "manifest.json");
            if (!metadataFile) {
                throw new Error("Metadata file not found");
            }
            // Use the uploaded arweave files in token metadata
            return `https://arweave.net/${metadataFile.transactionId}`;
        });
    }
    createMetadataInstructions({ data, authority = this.provider.wallet.publicKey, mint, mintAuthority = this.provider.wallet.publicKey, payer = this.provider.wallet.publicKey, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const metadata = yield mpl_token_metadata_1.Metadata.getPDA(mint);
            const instructions = new mpl_token_metadata_1.CreateMetadataV2({
                feePayer: payer,
            }, {
                metadata,
                mint,
                metadataData: new mpl_token_metadata_1.DataV2(Object.assign({}, data)),
                mintAuthority,
                updateAuthority: authority,
            }).instructions;
            return {
                instructions,
                signers: [],
                output: {
                    metadata,
                },
            };
        });
    }
    getMetadata(metadataKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const metadataAcc = yield this.provider.connection.getAccountInfo(metadataKey);
            return metadataAcc && new mpl_token_metadata_1.Metadata(metadataKey, metadataAcc).data;
        });
    }
    createMetadata(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const { instructions, signers, output } = yield this.createMetadataInstructions(args);
            yield this.sendInstructions(instructions, signers, args.payer);
            return output;
        });
    }
    updateMetadataInstructions({ data, newAuthority, metadata, updateAuthority, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const metadataAcct = (yield this.getMetadata(metadata));
            const instructions = new mpl_token_metadata_1.UpdateMetadataV2({}, {
                metadata,
                metadataData: data
                    ? new mpl_token_metadata_1.DataV2(Object.assign({}, data))
                    : new mpl_token_metadata_1.DataV2(Object.assign(Object.assign({}, metadataAcct.data), { collection: metadataAcct === null || metadataAcct === void 0 ? void 0 : metadataAcct.collection, uses: metadataAcct === null || metadataAcct === void 0 ? void 0 : metadataAcct.uses })),
                updateAuthority: updateAuthority || new web3_js_1.PublicKey(metadataAcct.updateAuthority),
                newUpdateAuthority: typeof newAuthority == "undefined"
                    ? new web3_js_1.PublicKey(metadataAcct.updateAuthority)
                    : newAuthority || undefined,
                primarySaleHappened: null,
                isMutable: null,
            }).instructions;
            return {
                instructions,
                signers: [],
                output: {
                    metadata,
                },
            };
        });
    }
    updateMetadata(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const { instructions, signers, output } = yield this.updateMetadataInstructions(args);
            yield this.sendInstructions(instructions, signers, args.payer);
            return output;
        });
    }
}
exports.SplTokenMetadata = SplTokenMetadata;
//# sourceMappingURL=splTokenMetadata.js.map