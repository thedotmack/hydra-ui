export declare class DataItem {
    private tag?;
    private data;
    constructor(data: any, tag?: number);
    setTag: (tag?: number) => void;
    clearTag: () => void;
    getTag: () => number;
    getData: () => any;
}
