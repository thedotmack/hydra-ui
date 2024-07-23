export declare function getExpirationString(expiration: number, UTCSecondsNow: number, config?: {
    delimiter?: " " | ":";
    capitalizeSuffix: boolean;
    showZeros?: boolean;
    includes?: {
        suffix: string;
        durationSeconds: number;
        mod: number;
    }[];
}): string;
export declare function shortDateString(utc_seconds: number): string;
export declare function longDateString(utcSeconds: number): string;
export declare function secondstoDuration(durationSeconds: number): string;
export declare const secondsToString: (requiredSeconds: number | undefined | null, showSeconds?: boolean) => string;
//# sourceMappingURL=dates.d.ts.map