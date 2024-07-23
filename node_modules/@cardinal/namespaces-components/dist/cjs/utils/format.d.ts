import { PublicKey } from "@solana/web3.js";
export declare const formatTwitterLink: (handle: string | undefined) => import("@emotion/react/jsx-runtime").JSX.Element;
export declare function shortPubKey(pubkey: PublicKey | string | null | undefined): string;
export declare const tryPublicKey: (publicKeyString: PublicKey | string | string[] | undefined | null) => PublicKey | null;
export declare const formatShortAddress: (address: PublicKey | undefined) => import("@emotion/react/jsx-runtime").JSX.Element;
export declare function tryGetImageUrl(handle: string, dev?: boolean): Promise<string | undefined>;
export declare function tryGetProfile(handle: string, dev?: boolean): Promise<{
    profile_image_url: string;
    username: string;
    id: string;
    name: string;
} | undefined>;
//# sourceMappingURL=format.d.ts.map