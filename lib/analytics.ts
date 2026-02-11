// Umami Analytics utility functions
// Documentation: https://umami.is/docs/track-events

type UmamiTracker = {
  track: (eventName: string, eventData?: Record<string, string | number>) => void
}

declare global {
  interface Window {
    umami?: UmamiTracker
  }
}

/**
 * Track a custom event in Umami
 * @param eventName - Name of the event (e.g., 'signup_click', 'download_pdf')
 * @param eventData - Optional key-value data to attach to the event
 *
 * @example
 * // Simple event
 * trackEvent('newsletter_subscribe')
 *
 * // Event with data
 * trackEvent('blog_read', { slug: 'my-post', category: 'tech' })
 */
export function trackEvent(eventName: string, eventData?: Record<string, string | number>) {
  if (typeof window !== "undefined" && window.umami) {
    window.umami.track(eventName, eventData)
  }
}

/**
 * Track a page view manually (Umami auto-tracks, but useful for SPAs)
 * @param url - The URL to track
 * @param referrer - Optional referrer URL
 */
export function trackPageView(url?: string, referrer?: string) {
  if (typeof window !== "undefined" && window.umami) {
    const data: Record<string, string> = {}
    if (url) data.url = url
    if (referrer) data.referrer = referrer
    window.umami.track("pageview", data)
  }
}

// Common event helpers
export const analytics = {
  // Newsletter
  newsletterSubscribe: () => trackEvent("newsletter_subscribe"),

  // Blog
  blogRead: (slug: string) => trackEvent("blog_read", { slug }),
  blogShare: (slug: string, platform: string) => trackEvent("blog_share", { slug, platform }),

  // Art
  artView: (slug: string) => trackEvent("art_view", { slug }),

  // Navigation
  externalLinkClick: (url: string) => trackEvent("external_link", { url }),

  // Contact
  contactClick: (type: string) => trackEvent("contact_click", { type }),
}
