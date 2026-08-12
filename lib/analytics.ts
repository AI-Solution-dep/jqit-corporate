export const googleAnalyticsMeasurementId = "G-4PB4361MG2";

type GoogleAnalyticsEventParams = Record<
  string,
  string | number | boolean | undefined
>;

declare global {
  interface Window {
    gtag?: (
      command: "event",
      eventName: string,
      params?: GoogleAnalyticsEventParams,
    ) => void;
  }
}

export function trackGoogleAnalyticsEvent(
  eventName: string,
  params?: GoogleAnalyticsEventParams,
): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params);
}
