export declare class PathComponent {
    static readonly HARDENED_BIT = 2147483648;
    private index?;
    private wildcard;
    private hardened;
    constructor(args: {
        index?: number;
        hardened: boolean;
    });
    getIndex: () => number;
    isWildcard: () => boolean;
    isHardened: () => boolean;
}
