import * as React from "react";
// New schema: page_view, copied_value, distribution_initiated, members_search
// Keep backwards compatibility for one release by accepting legacy names too.
export type AnalyticsEvent =
	| { name: "page_view"; page: string }
	| { name: "copied_value"; valueType: string }
	| { name: "distribution_initiated"; scope: "all" | "member"; memberId?: string }
	| { name: "members_search"; queryLength: number }
	// Legacy events (to be removed)
	| { name: "dashboard_mount" }
	| { name: "copy_address"; addressType: string }
	| { name: "distribute_click"; scope: "global" | "member"; memberId?: string }
	| { name: "search_members"; queryLength: number };
interface AnalyticsContextValue { track: (e: AnalyticsEvent) => void }
const AnalyticsContext = React.createContext<AnalyticsContextValue | null>(null);
export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const track = React.useCallback((e: AnalyticsEvent) => {
		// Emit normalized mirror for legacy events
		let normalized: AnalyticsEvent | null = null
		switch (e.name) {
			case 'dashboard_mount': normalized = { name: 'page_view', page: 'home' }; break;
			case 'copy_address': normalized = { name: 'copied_value', valueType: e.addressType }; break;
			case 'distribute_click': normalized = { name: 'distribution_initiated', scope: e.scope === 'global' ? 'all' : 'member', memberId: e.memberId }; break;
			case 'search_members': normalized = { name: 'members_search', queryLength: e.queryLength }; break;
		}
		console.debug('[analytics]', e)
		if (normalized) console.debug('[analytics-normalized]', normalized)
	}, [])
	return (<AnalyticsContext.Provider value={{ track }}>{children}</AnalyticsContext.Provider>)
};
export function useAnalytics() { const ctx = React.useContext(AnalyticsContext); if(!ctx) throw new Error("useAnalytics must be used within AnalyticsProvider"); return ctx }
