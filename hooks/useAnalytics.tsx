import * as React from "react";
// New schema: page_view, copied_value, distribution_initiated, members_search
// Keep backwards compatibility for one release by accepting legacy names too.
export type AnalyticsEvent =
	| { name: "page_view"; page: string }
	| { name: "copied_value"; valueType: string }
	| { name: "distribution_initiated"; scope: "all" | "member"; memberId?: string }
	| { name: "distribution_success"; scope: "all" | "member"; txCount: number; totalAmount?: number }
	| { name: "distribution_failure"; scope: "all" | "member"; reason?: string; memberId?: string }
	| { name: "members_search"; queryLength: number };
interface AnalyticsContextValue { track: (e: AnalyticsEvent) => void }
const AnalyticsContext = React.createContext<AnalyticsContextValue | null>(null);
export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const track = React.useCallback((e: AnalyticsEvent) => {
		// Directly emit new schema only (legacy removed)
		console.debug('[analytics]', e)
	}, [])
	return (<AnalyticsContext.Provider value={{ track }}>{children}</AnalyticsContext.Provider>)
};
export function useAnalytics() { const ctx = React.useContext(AnalyticsContext); if(!ctx) throw new Error("useAnalytics must be used within AnalyticsProvider"); return ctx }
