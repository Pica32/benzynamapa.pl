'use client';
import { useReportWebVitals } from 'next/web-vitals';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * WebVitals → Google Analytics 4 jako custom events.
 * Vercel Speed Insights běží paralelně přes <SpeedInsights /> v layout.
 */
export default function WebVitals() {
  useReportWebVitals(metric => {
    // Posílat do GA4 jen pokud je consent — pokud ne, gtag tichý.
    if (typeof window === 'undefined' || !window.gtag) return;

    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      // metric.value v ms; CLS je float, posíláme s dvěma desetinnými místy
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_label: metric.id,
      non_interaction: true,
      metric_id: metric.id,
      metric_value: metric.value,
      metric_delta: metric.delta,
      metric_rating: metric.rating, // 'good' | 'needs-improvement' | 'poor'
    });
  });
  return null;
}
