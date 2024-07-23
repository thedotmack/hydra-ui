import { PopupEvent, PopupConnection, EventCallback } from "./types";
export declare class Connection implements PopupConnection {
    readonly validatedOrigin: string;
    readonly targetWindow: Window;
    private readonly handlers;
    constructor(validatedOrigin: string, targetWindow: Window);
    off(event: PopupEvent, callback: EventCallback): void;
    on(event: PopupEvent, callback: EventCallback): void;
    send({ event, payload }: Parameters<PopupConnection['send']>[0]): void;
    runHandlersForEvent(event: PopupEvent, payload: unknown): void;
    resetHandlers(): void;
    export(): PopupConnection;
}
//# sourceMappingURL=connection.d.ts.map