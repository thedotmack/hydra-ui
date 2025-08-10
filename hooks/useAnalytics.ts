import * as React from "react";
export type AnalyticsEvent = { name: "dashboard_mount" } | { name: "copy_address"; addressType: string } | { name: "distribute_click"; scope: "global" | "member"; memberId?: string } | { name: "search_members"; queryLength: number };
interface AnalyticsContextValue { track: (e: AnalyticsEvent) => void }
const AnalyticsContext = React.createContext<AnalyticsContextValue | null>(null);
export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const track = React.useCallback((e: AnalyticsEvent) => { console.debug("[analytics]", e) }, [])
	return (
		<AnalyticsContext.Provider value={{ track }}>
			{children}
		</AnalyticsContext.Provider>
	)
}
export function useAnalytics() { const ctx = React.useContext(AnalyticsContext); if(!ctx) throw new Error("useAnalytics must be used within AnalyticsProvider"); return ctx }
